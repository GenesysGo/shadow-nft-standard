use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!(shadow_nft_common::MINTER_PROGRAM);

#[program]
pub mod shadowy_super_minter {
    use super::*;

    pub fn initialize<'b>(
        ctx: Context<'_, '_, '_, 'b, Initialize<'b>>,
        args: InitializeArgs,
    ) -> Result<()> {
        instructions::initialize(ctx, args)
    }

    pub fn mint(ctx: Context<Mint>) -> Result<()> {
        instructions::mint(ctx)
    }

    // pub fn add_assets(
    //     ctx: Context<AddAssets>,
    //     index: u32,
    //     assets: Vec<state::Asset>,
    // ) -> Result<()> {
    //     instructions::add_assets(ctx, index, assets)
    // }
}
