#[cfg(feature = "choose-random-zero")]
fn main() {
    use zerocopy_bitslice::ZeroCopyBitSlice;
    const MOCK_OFFSET: usize = 100;
    const MOCK_END_BUFFER: usize = 100;
    const NUM_ITEMS: u32 = 100;

    // Calculate required space for the `ZeroCopyBitSlice`
    let required_space: usize = ZeroCopyBitSlice::required_space(NUM_ITEMS);

    // Initalize some buffer w/ bytes on either end of where the `ZeroCopyBitSlice` will live
    let mut mock_minter: Vec<u8> = vec![0; MOCK_OFFSET + required_space + MOCK_END_BUFFER];

    // Get reference to the bit bytes and build `ZeroCopyBitSlice`
    let mut zcbs_bytes: &mut [u8] = &mut mock_minter[MOCK_OFFSET..];
    let mut zcbs: ZeroCopyBitSlice = ZeroCopyBitSlice::intialize_in(NUM_ITEMS, &mut zcbs_bytes);

    // Build random sequence
    let mut sequence: [u32; NUM_ITEMS as usize] = std::array::from_fn(|_a_new_minter_appears| {
        // Mock seed ingredients
        let mock_time: i64 = 123456890;
        let mock_time_bytes: [u8; 8] = mock_time.to_le_bytes();
        let mock_time_seed: [u8; 32] = core::array::from_fn(|i| mock_time_bytes[i % 8]);
        let mock_slothash: [u8; 32] = core::array::from_fn(|i| i as u8);
        let mock_minter_pubkey: [u8; 32] = core::array::from_fn(|i| i as u8);

        // Build seed
        let seed: [u8; 32] =
            core::array::from_fn(|i| mock_time_seed[i] ^ mock_slothash[i] ^ mock_minter_pubkey[i]);

        // Get element in sequence
        zcbs.choose_random_zero(seed)
            .expect("we are minting exactly the right number of items")
    });

    // Show sequence and sorted sequence
    println!("random sequence is {sequence:?}");
    sequence.sort();
    println!("sorted sequence is {sequence:?}");
}

#[cfg(not(feature = "choose-random-zero"))]
fn main() {}
