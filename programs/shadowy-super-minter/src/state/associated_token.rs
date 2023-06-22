use anchor_lang::solana_program::pubkey::Pubkey;

#[derive(Clone)]
pub struct TokenAccount(anchor_spl::associated_token::AssociatedToken);

impl anchor_lang::Owner for TokenAccount {
    fn owner() -> Pubkey {
        spl_associated_token_account::id()
    }
}

#[derive(Clone)]
pub struct AssociatedToken;

impl anchor_lang::Id for AssociatedToken {
    fn id() -> Pubkey {
        spl_associated_token_account::id()
    }
}
