import { PublicKey } from "@solana/web3.js"

// Program ID defined in the provided IDL. Do not edit, it will get overwritten.
export const MINTER_PROGRAM_ID_IDL = new PublicKey(
  "AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu"
);

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const MINTER_PROGRAM_ID_CLI = new PublicKey(
  "AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu"
)

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export const MINTER_PROGRAM_ID: PublicKey = MINTER_PROGRAM_ID_CLI;
