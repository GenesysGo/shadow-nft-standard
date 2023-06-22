use anchor_lang::prelude::Pubkey;

pub fn get_payer_pda(mint: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"payer_pda", mint.as_ref()], &crate::MINTER_PROGRAM).0
}
