#![cfg_attr(not(feature = "std"), no_std)]

use shadow_nft_common::array_from_fn;

/// LenType can be any type 32-bit or lower.
type LenType = u32;

const LEN_SIZE: usize = ::core::mem::size_of::<LenType>();
const BITS_PER_BYTE: usize = 8;

/// A zero copy container that helps read from and write to the bits in a `&[u8]`.
pub struct ZeroCopyBitSlice<'a> {
    /// The bytes that contain the bits
    bit_bytes: &'a mut [u8],
    /// The number of bits contained in the bytes (possibly not equal to )
    bit_len: LenType,
}

/// A zero copy container that helps read from and write to the bits in a `&[u8]`.
pub struct ZeroCopyBitSliceRead<'a> {
    /// The bytes that contain the bits
    bit_bytes: &'a [u8],
    /// The number of bits contained in the bytes (possibly not equal to )
    bit_len: LenType,
}

impl<'a> ZeroCopyBitSlice<'a> {
    /// Initializes a `ZeroCopyBitSlice` with `num_bits` bits within the buffer provided.
    /// Requires space for the bit length in addition to bytes for all bits.
    ///
    /// We also update the position of the reference to just after the end of the bitslice.
    ///
    /// Panics if buffer is not large enough.
    pub fn intialize_in<'o>(
        num_bits: LenType,
        bytes: &'o mut &'a mut [u8],
    ) -> ZeroCopyBitSlice<'a> {
        // Calculate number of contiguous bytes required to store this number of bits.
        // Because the `LenType` is <= 32 bits (i.e. `LenType::MAX < usize::MAX` and a `usize` has
        // nonzero size) div_ceil can be done with unchecked math
        let byte_len = (num_bits as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

        // Calculate required buffer size
        let required_size = byte_len + LEN_SIZE;
        if bytes.len() < required_size {
            panic!("buffer provided for initialization is not large enough")
        }

        // Write size to buffer
        bytes[0..LEN_SIZE].copy_from_slice(num_bits.to_le_bytes().as_ref());

        // Split input bytes and update pointer
        let (bit_bytes, rest) = unsafe {
            ::core::mem::transmute::<(&'o mut [u8], &'o mut [u8]), (&'a mut [u8], &'a mut [u8])>(
                bytes.split_at_mut(LEN_SIZE + byte_len),
            )
        };
        *bytes = rest;

        ZeroCopyBitSlice {
            bit_bytes: &mut bit_bytes[LEN_SIZE..LEN_SIZE + byte_len],
            bit_len: num_bits,
        }
    }

    /// Given a pointer to a `&mut [u8]` with a **previously initialized** `ZeropCopyBitSlice<'a>,
    /// perform zero copy deserialization on the byte array containing the bits.
    pub fn from_bytes(bytes: &'a mut [u8]) -> ZeroCopyBitSlice<'a> {
        // Get lengths
        // 1) Read length (in bits!) as LenType from a little endian format
        // 2) Calculate number of contiguous bytes required to store this number of bits.
        //    Because the LenType` is <= 32 bits (i.e. `LenType::MAX < usize::MAX` and a `usize` has
        //    nonzero size) div_ceil can be done with unchecked math
        let bit_len: LenType = LenType::from_le_bytes(array_from_fn::from_fn(|i| bytes[i]));
        let byte_len = (bit_len as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

        // Then get rest
        let bit_bytes: &mut [u8] = &mut bytes[LEN_SIZE..LEN_SIZE + byte_len];

        ZeroCopyBitSlice { bit_bytes, bit_len }
    }

    /// Given a pointer to a `&mut [u8]` with a **previously initialized** `ZeropCopyBitSlice<'a>,
    /// perform zero copy deserialization on the byte array containing the bits.
    pub fn from_bytes_update<'o>(bytes: &'o mut &'a mut [u8]) -> ZeroCopyBitSlice<'a> {
        // Get lengths
        // 1) Read length (in bits!) as LenType from a little endian format
        // 2) Calculate number of contiguous bytes required to store this number of bits.
        //    Because the LenType` is <= 32 bits (i.e. `LenType::MAX < usize::MAX` and a `usize` has
        //    nonzero size) div_ceil can be done with unchecked math
        let bit_len: LenType = LenType::from_le_bytes(array_from_fn::from_fn(|i| bytes[i]));
        let byte_len = (bit_len as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

        // Then get bit_bytes, rest of bytes, and update pointer
        let (bit_bytes, rest) = unsafe {
            ::core::mem::transmute::<(&'o mut [u8], &'o mut [u8]), (&'a mut [u8], &'a mut [u8])>(
                bytes[LEN_SIZE..].split_at_mut(byte_len),
            )
        };
        *bytes = rest;

        ZeroCopyBitSlice { bit_bytes, bit_len }
    }

    /// The number of bits contained within this bit slice
    pub fn bit_len(&self) -> LenType {
        self.bit_len
    }

    /// The number bytes used to store these bits
    pub fn byte_len(&self) -> usize {
        self.bit_bytes.len()
    }

    /// Sets the value of the bit at position `idx`.
    ///
    /// Panics if out of bounds.
    pub fn set(&mut self, idx: LenType, value: bool) {
        // Check bounds
        if idx >= self.bit_len {
            panic!("bit index is out of bounds");
        }

        // Calculate bit location.
        let byte_idx: usize = idx as usize / BITS_PER_BYTE;
        let rel_bit_idx: u8 = idx as u8 % BITS_PER_BYTE as u8;

        if value {
            // If value is true, we set the bit at rel_bit_idx to 1.
            self.bit_bytes[byte_idx] |= 1 << rel_bit_idx;
        } else {
            // If value is false, we set the bit at rel_bit_idx to 0.
            self.bit_bytes[byte_idx] &= !(1 << rel_bit_idx);
        }
    }

    /// Retrieves the value of the bit at position `idx`.
    ///
    /// Panics if out of bounds.
    pub fn get(&self, idx: LenType) -> bool {
        // Check bounds
        if idx as LenType >= self.bit_len {
            panic!("bit index is out of bounds");
        }

        // Calculate bit location
        let byte_idx: usize = (idx as usize) / BITS_PER_BYTE;
        let rel_bit_idx: u8 = (idx as u8) % (BITS_PER_BYTE as u8);

        // Check if the bit at rel_bit_idx is set. This operation masks all other bits and checks if the result is non-zero.
        (self.bit_bytes[byte_idx] & (1 << rel_bit_idx)) != 0
    }

    /// Chooses a random zero bit from within the bitslice, setting the bit to 1 and returning the bit's index.
    ///
    /// Returns `None` if all bits are set to 1.
    #[cfg(feature = "choose-random-zero")]
    pub fn choose_random_zero(&mut self, seed: impl AsRef<[u8]>) -> Option<LenType> {
        use sha2::{Digest, Sha256};

        // First calculate the number of zeros and handle num_zeros = 0 case
        let num_zeros: LenType = self.num_zeros();
        if num_zeros == 0 {
            return None;
        }

        // Then calculate a hash-based pseudorandom seed
        let seed = {
            let mut hasher = Sha256::new();
            hasher.update(seed.as_ref());
            hasher.finalize()
        };

        // Use the first `LEN_SIZE` bytes from the hash to construct an index that is maybe out of bounds,
        // the bring it in within bounds. Note this is the index among zeros not the global bit index.
        let maybe_oob_index: LenType = LenType::from_le_bytes(array_from_fn::from_fn(|i| seed[i]));
        let zero_index = maybe_oob_index % num_zeros;

        // Finally, find global index of zero bit and set that bit to 1
        find_and_set_nth_zero_bit(self.bit_bytes, zero_index, self.bit_len)
    }

    /// Calculates the number of zero bits in the bitslice.
    pub fn num_zeros(&self) -> LenType {
        // Handle zero length case
        if self.byte_len() == 0 {
            return 0;
        }

        // First count the zeros in all complete bytes (all bytes which fully occupy 8 bits,
        // which is either all of them when bit_len is divisible by 8 or all but the last if not)
        let num_complete_bytes = (self.bit_len as usize)
            .checked_div(BITS_PER_BYTE)
            .expect("already handled zero byte_len case");

        // Initialize accumulator variable
        let mut zeros = 0;

        // Count all zeros in complete bytes
        for byte in &self.bit_bytes[0..num_complete_bytes] {
            zeros += byte.count_zeros();
        }

        // Add last byte if necessary
        if num_complete_bytes < self.byte_len() {
            // Get the last byte
            let last_byte = *self
                .bit_bytes
                .last()
                .expect("already handled zero byte_len case");

            // If we are in this branch, it is because bit_len is not divisible by 8.
            // So this arithmetic should not overflow
            let up_to = (self.bit_len() % 8) as u8 - 1;

            // Count zeros up to the `up_to` bit (zero index)
            zeros += count_zero_bits_in_byte_up_to_bit(last_byte, up_to);
        }

        zeros
    }

    /// Calculates the requires number of bytes to initialize a `ZeroCopyBitSlice`, e.g. via
    /// `initialize_in`.
    pub const fn required_space(num_bits: LenType) -> usize {
        // Because the LenType` is <= 32 bits (i.e. `LenType::MAX < usize::MAX` and a `usize` has
        // nonzero size) div_ceil can be done with unchecked math
        LEN_SIZE + (num_bits as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE
    }
}

/// Given a slice of bytes, we find the `nth` zero bit (zero indexed; 0 is first zero bit). Upon
/// finding it, we set the bit to 1 and return its global bit index.
///
/// Instead of iterating through individual bits to find a particular zero, it is possible to
/// count the number of zero bits one byte at a time. So, to find the `nth` bit, we take this chunk
/// approach until we reach a byte where the cumulative number of zero bits exceeds the target bit.
/// Then, we switch over to a bit by bit approach, find the nth zero bit, set it to 1, and return the
/// global bit position.
fn find_and_set_nth_zero_bit(bytes: &mut [u8], nth: LenType, bit_len: LenType) -> Option<LenType> {
    // Initialize zero bit counter
    let mut zero_count: LenType = 0;

    for (&byte, byte_idx) in bytes.iter().zip(0..) {
        // Calculate the number of zeros in this byte
        let byte_zero_count = byte.count_zeros() as LenType;

        // If the cumulative number of zeros exceeds the target zero bit, switch to bit-by-bit approach
        if zero_count + byte_zero_count > nth {
            // Iterate through each bit in the byte
            for rel_bit_idx in 0..8 {
                // Handle case where the number of bits is not divisible by 8 and return early
                if byte_idx * 8 + rel_bit_idx == bit_len {
                    return None;
                }

                // Check for zero bit
                if (byte & (1 << rel_bit_idx)) == 0 {
                    // Check if zero bit is nth zero bit
                    if zero_count == nth {
                        // If so, set bit to 1 and return global bit index
                        bytes[byte_idx as usize] |= 1 << rel_bit_idx;
                        return Some(byte_idx * 8 + rel_bit_idx);
                    }

                    // Increment if we find zero bit
                    zero_count += 1;
                }
            }
        } else {
            // Batch increment
            zero_count += byte_zero_count;
        }
    }

    None
}
impl<'a> ZeroCopyBitSliceRead<'a> {
    /// Given a pointer to a `&mut [u8]` with a **previously initialized** `ZeropCopyBitSlice<'a>,
    /// perform zero copy deserialization on the byte array containing the bits.
    pub unsafe fn from_bytes(bytes: &'a [u8]) -> ZeroCopyBitSliceRead<'a> {
        // Get lengths
        // 1) Read length (in bits!) as LenType from a little endian format
        // 2) Calculate number of contiguous bytes required to store this number of bits.
        //    Because the LenType` is <= 32 bits (i.e. `LenType::MAX < usize::MAX` and a `usize` has
        //    nonzero size) div_ceil can be done with unchecked math
        let bit_len: LenType = LenType::from_le_bytes(array_from_fn::from_fn(|i| bytes[i]));
        let byte_len = (bit_len as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

        // Then get rest
        let bit_bytes: &[u8] = &bytes[LEN_SIZE..LEN_SIZE + byte_len];

        ZeroCopyBitSliceRead { bit_bytes, bit_len }
    }

    /// Calculates the number of zero bits in the bitslice.
    pub fn num_zeros(&self) -> LenType {
        // Handle zero length case
        if self.byte_len() == 0 {
            return 0;
        }

        // First count the zeros in all complete bytes (all bytes which fully occupy 8 bits,
        // which is either all of them when bit_len is divisible by 8 or all but the last if not)
        let num_complete_bytes = (self.bit_len as usize)
            .checked_div(BITS_PER_BYTE)
            .expect("already handled zero byte_len case");

        // Initialize accumulator variable
        let mut zeros = 0;

        // Count all zeros in complete bytes
        for byte in &self.bit_bytes[0..num_complete_bytes] {
            zeros += byte.count_zeros();
        }

        // Add last byte if necessary
        if num_complete_bytes < self.byte_len() {
            // Get the last byte
            let last_byte = *self
                .bit_bytes
                .last()
                .expect("already handled zero byte_len case");

            // If we are in this branch, it is because bit_len is not divisible by 8.
            // So this arithmetic should not overflow
            let up_to = (self.bit_len() % 8) as u8 - 1;

            // Count zeros up to the `up_to` bit (zero index)
            zeros += count_zero_bits_in_byte_up_to_bit(last_byte, up_to);
        }

        zeros
    }

    /// The number of bits contained within this bit slice
    pub fn bit_len(&self) -> LenType {
        self.bit_len
    }

    /// The number bytes used to store these bits
    pub fn byte_len(&self) -> usize {
        self.bit_bytes.len()
    }
}

#[test]
fn test_find_and_set_bit() {
    // Some bytes to play with.
    // In this example, the third zero bit (nth = 2) is the 4th bit (index = 3).
    // AFTER having set that one to 1, the 5th zero bit (nth = 4) is the 7th bit (index = 6);
    // AFTER these two are set to 1, the 9th zero bit (nth = 8) is the 15th bit (index = 14);
    //
    // Note: Recall that the bits in an individual byte are read from right to left.
    let mut bytes = [0b_0000_0010, 0b_1010_1010];
    let expected_ = [0b_0100_1010, 0b_1110_1010];
    let exp_idxs = [3, 6, 14];

    let idx1 = find_and_set_nth_zero_bit(&mut bytes, 2, 16).unwrap();
    let idx2 = find_and_set_nth_zero_bit(&mut bytes, 4, 16).unwrap();
    // Save the state for some later tests
    let later_test = bytes;
    let idx3 = find_and_set_nth_zero_bit(&mut bytes, 8, 16).unwrap();

    // Check for correct indices and bytes state
    assert_eq!(idx1, exp_idxs[0]);
    assert_eq!(idx2, exp_idxs[1]);
    assert_eq!(idx3, exp_idxs[2]);
    assert_eq!(bytes, expected_);

    // Here we test for cases where the number of bits is not divisible by 8.
    //
    // If we had set bit_len to 15, this last operation should still be in bounds,
    // but a bit_len of 14 should results in an out-of-bounds access -> None
    //
    // We reuse the state of the bytes as frozen before idx3 for these two tests
    let idx3_2 = find_and_set_nth_zero_bit(&mut later_test.clone(), 8, 15).unwrap();
    assert_eq!(idx3, idx3_2);
    assert!(find_and_set_nth_zero_bit(&mut later_test.clone(), 8, 14).is_none());
}

#[inline(always)]
fn count_zero_bits_in_byte_up_to_bit(byte: u8, up_to_bit: u8) -> LenType {
    (!byte << (7 - up_to_bit)).count_ones()
}

#[test]
fn test_count_zero_up_to() {
    // Sanity check, not full correctness check
    for up_to_bit in 0..=7 {
        for byte in 0..=u8::MAX {
            let count = count_zero_bits_in_byte_up_to_bit(byte, up_to_bit);
            assert!(
                count <= up_to_bit as u32 + 1,
                "got {count} <= {up_to_bit} for {byte:08b} up to {up_to_bit}"
            );
        }
    }

    // Check a few cases
    let few_cases = [0b_0000_0100, 0b_0010_0010, 0b_1010_1010, 0b_1111_0111];
    // Up to index 3 (first 4)
    let expected_3 = [3, 3, 2, 1];
    // up to index 5 (first 6)
    let expected_5 = [5, 4, 3, 1];
    for i in 0..4 {
        assert_eq!(
            count_zero_bits_in_byte_up_to_bit(few_cases[i], 3),
            expected_3[i]
        );
        assert_eq!(
            count_zero_bits_in_byte_up_to_bit(few_cases[i], 5),
            expected_5[i]
        );
    }
}

#[test]
fn test_deserialization() {
    // For this test, must be a number in 9..16 because of the two flag bytes
    const BIT_LEN: LenType = 9;
    const BYTE_LEN: usize = (BIT_LEN as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

    // There exists some underlying allocation of bytes with:
    // 1) two dummy bytes
    let [d1, d2] = [7, 3];
    // 2) a LenType length
    let [l1, l2, l3, l4] = LenType::to_le_bytes(BIT_LEN);
    // 3) bits living in bytes within their corresponding length
    let [flags1, flags2] = [0b10101010, 0b10000000];
    // 4) another two dummy bytes
    let [d3, d4] = [4, 5];
    let mut bytes: Vec<u8> = vec![d1, d2, l1, l2, l3, l4, flags1, flags2, d3, d4];

    // Construct it w/ bytes at correct location
    let zcbs = ZeroCopyBitSlice::from_bytes(&mut bytes[2..]);

    // Check for correct lengths and content
    assert_eq!(zcbs.bit_len(), BIT_LEN);
    assert_eq!(zcbs.byte_len(), BYTE_LEN);
    assert_eq!(zcbs.bit_bytes, &[flags1, flags2]);
}

#[test]
fn test_initialization() {
    // For this test, must be a number in 9..16 because of the two flag bytes
    const BIT_LEN: LenType = 9;
    const BYTE_LEN: usize = (BIT_LEN as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

    // Initialize buffer
    let mut buffer = [0; BYTE_LEN + LEN_SIZE];
    let mut buf_slice = buffer.as_mut_slice();

    // Construct it w/ bytes at correct location
    let zcbs = ZeroCopyBitSlice::intialize_in(BIT_LEN, &mut buf_slice);
    assert_eq!(zcbs.bit_len(), BIT_LEN);
    assert_eq!(zcbs.byte_len(), BYTE_LEN);
    drop(zcbs);

    // Check buf_slice reference was updated properly
    assert_eq!(buf_slice.len(), 0);

    // Check corrent bit_len was written to buffer
    let bit_len: LenType = LenType::from_le_bytes(array_from_fn::from_fn(|i| buffer[i]));
    assert_eq!(bit_len, BIT_LEN);
}

#[test]
fn test_reads_and_writes() {
    // Get LenType length
    const BIT_LEN: LenType = 9;
    const BYTE_LEN: usize = (BIT_LEN as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

    // Construct bit slice
    let mut zcbs = ZeroCopyBitSlice {
        bit_bytes: &mut [0; BYTE_LEN],
        bit_len: BIT_LEN,
    };

    // All bits should be false
    for bit_idx in 0..BIT_LEN {
        assert!(!zcbs.get(bit_idx));
    }

    // Set every other bit to true
    for bit_idx in 0..BIT_LEN {
        zcbs.set(bit_idx, bit_idx % 2 == 0);
    }

    // Check whether bits updated properly
    for bit_idx in 0..BIT_LEN {
        assert_eq!(zcbs.get(bit_idx), bit_idx % 2 == 0);
    }

    // Flip all bits
    for bit_idx in 0..BIT_LEN {
        zcbs.set(bit_idx, bit_idx % 2 != 0);
    }

    // Check whether bits updated properly
    for bit_idx in 0..BIT_LEN {
        assert_eq!(zcbs.get(bit_idx), bit_idx % 2 != 0);
    }
}

#[test]
#[cfg(feature = "choose-random-zero")]
fn test_get_random() {
    const BIT_LEN: LenType = 9;
    const BYTE_LEN: usize = (BIT_LEN as usize + BITS_PER_BYTE - 1) / BITS_PER_BYTE;

    // In this test we generate random sequences.
    // We cannot straightforwardly predict the deterministic randoms sequences.
    //
    // So, we probe correctness with the following checks:
    // 1) We check that >3/4 of the trials are not equal to the sorted sequence
    // 2) The sequences must contain all elements, so we compare with sorted array

    // The expected sorted results for all seeds
    let expected_sorted = array_from_fn::from_fn(|i| i as LenType);
    let mut unequal_counter = 0;

    const TRIALS: u16 = 128;
    for trial in 0..TRIALS {
        // For every seed initialize a new zcbs
        let mut zcbs = ZeroCopyBitSlice {
            bit_bytes: &mut [0; BYTE_LEN],
            bit_len: BIT_LEN,
        };

        // Turn the trial into a `&[u8]` seed
        let seed = trial.to_le_bytes();

        // Get the random sequence
        let mut sequence: [LenType; BIT_LEN as usize] = array_from_fn::from_fn(|i| {
            // Check that the number of zeros decrements properly
            assert_eq!(zcbs.num_zeros(), BIT_LEN - i as LenType);

            // Get next element in random sequence
            zcbs.choose_random_zero(seed).unwrap()
        });

        // Increment in unequal for Check #1
        if sequence != expected_sorted {
            unequal_counter += 1;
        }

        // Do check #2
        sequence.sort();
        assert_eq!(sequence, expected_sorted);
    }

    // Do check #1
    assert!(unequal_counter > 3 * TRIALS / 4);
}
