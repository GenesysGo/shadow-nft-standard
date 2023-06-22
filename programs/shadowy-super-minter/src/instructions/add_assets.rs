use crate::{
    constants::{ASSET_ARRAY_START, ASSET_SIZE, MAX_NAME_LENGTH},
    errors::ShadowyError,
    state::{Asset, ShadowySuperMinter},
};
use anchor_lang::prelude::*;
use arrayref::array_ref;
use shadow_nft_standard::common::creator_group::CreatorGroup;
use std::cell::RefMut;

// TODO: revisit for cases where 1 char != 1 byte
fn pad_string(input: &str, max_length: usize) -> String {
    let padding = vec![
        0u8;
        max_length
            .checked_sub(input.len())
            .expect("TODO graceful error: string exceed max length")
    ];
    input.to_string() + std::str::from_utf8(&padding).unwrap()
}

fn set_bit_in_byte_vector(vec: &mut [u8], bit_index: usize) {
    let byte_index = bit_index / 8;
    let bit_position = bit_index % 8;
    vec[byte_index] |= 1 << bit_position;
}

pub fn add_assets(ctx: Context<AddAssets>, index: u32, assets: Vec<Asset>) -> Result<()> {
    let shadowy_super_minter = &mut ctx.accounts.shadowy_super_minter;
    let account = shadowy_super_minter.to_account_info();
    let current_count = get_asset_count(&account.data.borrow_mut())?;
    let mut data = account.data.borrow_mut();

    let fixed_assets: Vec<Asset> = assets
        .iter()
        .map(|line| Asset {
            name: pad_string(&line.name, MAX_NAME_LENGTH),
            uri: line.uri.clone(),
        })
        .collect();

    if fixed_assets.is_empty() {
        msg!("Assets array empty");
        return Ok(());
    }

    let total = index
        .checked_add(fixed_assets.len() as u32)
        .ok_or(ShadowyError::NumericalOverflowError)?;
    if total > (shadowy_super_minter.items_available as u32) {
        return err!(ShadowyError::IndexGreaterThanLength);
    }

    let serialized: Vec<u8> = fixed_assets.try_to_vec()?.split_off(4);

    let position = ASSET_ARRAY_START + 4 + (index as usize) * ASSET_SIZE;
    data[position..position + serialized.len()].copy_from_slice(&serialized);

    let bit_mask_vec_start =
        ASSET_ARRAY_START + 4 + (shadowy_super_minter.items_available as usize) * ASSET_SIZE + 4;

    let mut new_count = current_count;
    for i in 0..fixed_assets.len() {
        let position = index as usize + i;
        set_bit_in_byte_vector(&mut data[bit_mask_vec_start..], position);
        if data[bit_mask_vec_start + position / 8] == 1 << (position % 8) {
            new_count = new_count
                .checked_add(1)
                .ok_or(ShadowyError::NumericalOverflowError)?;
        }
    }

    data[0..4].copy_from_slice(&(new_count as u32).to_le_bytes());
    Ok(())
}

pub fn get_asset_count(data: &RefMut<&mut [u8]>) -> Result<usize> {
    Ok(u32::from_le_bytes(*array_ref![data, ASSET_ARRAY_START, 4]) as usize)
}

#[derive(Accounts)]
pub struct AddAssets<'info> {
    #[account(mut, constraint = creator_group.creators.contains(&authority.key()))]
    shadowy_super_minter: Account<'info, ShadowySuperMinter>,

    authority: Signer<'info>,

    creator_group: Account<'info, CreatorGroup>,
}

// pub(crate) const MAX_CREATOR_LIMIT: usize = 5;

// pub(crate) const MAX_CREATOR_LEN: usize = 32 + 1 + 1;

// pub(crate) const MAX_NAME_LENGTH: usize = 32;

// pub(crate) const MAX_SYMBOL_LENGTH: usize = 10;

// pub(crate) const MAX_URI_LENGTH: usize = 200;

// pub(crate) const ASSET_SIZE: usize = 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH;

// pub(crate) const ASSET_ARRAY_START: usize = 32 + // authority
//     8 + // price
//     8 + // items available
//     9 + // go live
//     4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
//     2 + // seller fee basis points
//     4 + MAX_CREATOR_LIMIT*MAX_CREATOR_LEN + // optional + u32 len + actual vec
//     8 + //max supply
//     1 + // is mutable
//     1 + // retain authority
//     4 + MAX_NAME_LENGTH + // name length,
//     4 + MAX_URI_LENGTH + // uri length,
//     32 + // hash
//     4 +  // max number of lines;
//     8; // items redeemed
