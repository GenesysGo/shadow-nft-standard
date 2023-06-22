//! The purpose of this module is to remove a circular depenedency between the minter and standard
//! program crates. The minter program executes a cpi into the standard program, and the standard
//! program verifies that a minter program derived address is a signer.
pub use anchor_lang::prelude::Pubkey;

/// AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu
pub const MINTER_PROGRAM: Pubkey = from_str("AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu");

/// 9fQse1hBRfzWweeUod6WEsR4jZf7hVucetEheCaWooY5
pub const STANDARD_PROGRAM: Pubkey = from_str("9fQse1hBRfzWweeUod6WEsR4jZf7hVucetEheCaWooY5");

pub const fn try_from_str(input: &str) -> Result<Pubkey, &'static str> {
    match decode_pubkey(input.as_bytes()) {
        Ok(bytes) => Ok(Pubkey::new_from_array(bytes)),
        Err(e) => Err(e),
    }
}

pub const fn from_str(input: &str) -> Pubkey {
    match try_from_str(input) {
        Ok(pubkey) => pubkey,
        Err(_) => panic!("Invalid base58 Pubkey (Solana & Bitcoin Alphabet)"),
    }
}

/// This is const-ified from base58 crate
const fn new(base: &[u8; 58]) -> ([u8; 58], [u8; 128]) {
    let mut encode = [0x00; 58];
    let mut decode = [0xFF; 128];

    let mut i = 0;
    while i < encode.len() {
        encode[i] = base[i];
        decode[base[i] as usize] = i as u8;
        i += 1;
    }

    (encode, decode)
}

/// This is const-ified from base58 crate
///
/// TODO: still need to handle oob w/o panic but like cmon just provide a valid pubkey str
const fn decode_pubkey(input: &[u8]) -> Result<[u8; 32], &'static str> {
    let mut output = [0; 32];

    const SOLANA_ALPHABET: [u8; 58] =
        *b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const ENCODE_DECODE: ([u8; 58], [u8; 128]) = new(&SOLANA_ALPHABET);
    const ENCODE: [u8; 58] = ENCODE_DECODE.0;
    const DECODE: [u8; 128] = ENCODE_DECODE.1;
    const ZERO: u8 = ENCODE[0];

    let mut index = 0;

    let len = input.len();
    let mut i = 0;
    while i < len {
        let c = &input[i];

        if *c > 127 {
            return Err("Input contains non-ASCII");
        }

        let mut val = DECODE[*c as usize] as usize;
        if val == 0xFF {
            return Err("Input contains invalid char");
        }

        let mut inner_idx = 0;
        while inner_idx < index {
            val += (output[inner_idx] as usize) * 58;
            output[inner_idx] = (val & 0xFF) as u8;
            val >>= 8;
            inner_idx += 1;
        }

        while val > 0 {
            output[index] = (val & 0xFF) as u8;
            index += 1;
            val >>= 8;
        }

        i += 1;
    }

    let mut idx = 0;
    let mut c = input[idx];
    while c == ZERO {
        c = input[idx];
        idx += 1;

        output[index] = 0;
        index += 1;
    }

    let mut rev_output = [0; 32];
    let mut idx = 0;
    while idx < 32 {
        rev_output[idx] = output[31 - idx];
        idx += 1;
    }
    Ok(rev_output)
}

#[test]
fn test_two_cases() {
    let input = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
    let expected = Pubkey::new_from_array([
        218, 7, 92, 178, 255, 94, 198, 129, 118, 19, 222, 83, 11, 105, 42, 135, 53, 71, 119, 105,
        218, 71, 67, 12, 189, 129, 84, 51, 92, 74, 131, 39,
    ]);
    assert_eq!(from_str(input), expected);

    let input = "fBhaujR6iaQkiaDZPsQb5LXLK7y5cRsTaddBV3UWNTq";
    let expected = Pubkey::new_from_array([
        9, 200, 43, 65, 225, 51, 167, 33, 30, 3, 37, 197, 7, 16, 205, 73, 131, 203, 140, 102, 102,
        250, 52, 161, 17, 175, 31, 193, 190, 161, 212, 128,
    ]);
    assert_eq!(from_str(input), expected);
}
