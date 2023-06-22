//! This library is to be used to represent urls, extensions, and filepaths compactly.
//! These use cases prohibit newline characters and are typically under 256 bytes.
//! As such, we use a smaller length to avoid needing to ser/de a 4 or 8 byte length type.

use shadow_nft_common::array_from_fn;

#[derive(Debug, PartialEq, Clone, Copy)]
pub struct ZeroCopyStr<'a> {
    inner: &'a str,
}

type LenType = u8;
const LEN_TYPE_SIZE: usize = ::core::mem::size_of::<LenType>();

impl<'a> ZeroCopyStr<'a> {
    /// Writes the contents of a `&str` within the buffer provided.
    /// Requires space for the `str` byte length + LEN_TYPE_SIZE length.
    ///
    /// We also return a new reference pointing just after the end of the `str` written.
    ///
    /// Panics if buffer is not large enough.
    pub fn write_to(str: &str, bytes: &'a mut [u8]) -> (ZeroCopyStr<'a>, &'a mut [u8]) {
        // Calculate required buffer size
        let str_byte_len = str.as_bytes().len();
        let required_size = str.as_bytes().len() + LEN_TYPE_SIZE;
        if str_byte_len > LenType::MAX as usize {
            panic!("the string provided is too large");
        }
        if bytes.len() < required_size {
            panic!("buffer provided for initialization is not large enough");
        }

        // Write str length
        bytes[..LEN_TYPE_SIZE].copy_from_slice(&(str.as_bytes().len() as LenType).to_le_bytes());

        // Write str to buffer
        bytes[LEN_TYPE_SIZE..LEN_TYPE_SIZE + str_byte_len].copy_from_slice(str.as_bytes());

        // Get reference to buffer after write location
        let (len_inner, rest) = bytes.split_at_mut(required_size);

        // Build the inner &str
        // Note that the inner &str is not the original reference.
        // This is a reference to where the bytes were written.
        let (_len, inner_bytes) = len_inner.split_at(LEN_TYPE_SIZE);
        let inner = ::core::str::from_utf8(inner_bytes)
            .expect("the user should have passed in a valid &str");

        // Return the `ZeroCopyStr` and new mut slice
        (ZeroCopyStr { inner }, rest)
    }

    /// Writes the contents of a `&str` within the buffer provided.
    /// Requires space for the `str` byte length + LEN_TYPE_SIZE length.
    ///
    /// We also update the position of the reference to just after the end of the `str`.
    ///
    /// Panics if buffer is not large enough.
    pub fn write_to_update<'o>(str: &str, bytes: &'o mut &'a mut [u8]) -> ZeroCopyStr<'a> {
        // Calculate required buffer size
        let str_byte_len = str.as_bytes().len();
        let required_size = str.as_bytes().len() + LEN_TYPE_SIZE;
        if str_byte_len > LenType::MAX as usize {
            panic!("the string provided is too large");
        }
        if bytes.len() < required_size {
            panic!("buffer provided for initialization is not large enough");
        }

        // Write str length
        bytes[..LEN_TYPE_SIZE].copy_from_slice(&(str.as_bytes().len() as LenType).to_le_bytes());

        // Write str to buffer
        bytes[LEN_TYPE_SIZE..LEN_TYPE_SIZE + str_byte_len].copy_from_slice(str.as_bytes());

        // Update pointer
        let (len_inner, rest) = unsafe {
            ::core::mem::transmute::<(&'o mut [u8], &'o mut [u8]), (&'a mut [u8], &'a mut [u8])>(
                bytes.split_at_mut(required_size),
            )
        };
        *bytes = rest;

        // Build the inner &str
        // Note that the inner &str is not the original reference.
        // This is a reference to where the bytes were written.
        let (_len, inner_bytes) = len_inner.split_at(LEN_TYPE_SIZE);
        let inner = ::core::str::from_utf8(inner_bytes)
            .expect("the user should have passed in a valid &str");

        // Return the `ZeroCopyStr`
        ZeroCopyStr { inner }
    }

    /// Zero-copy deserializes bytes into `ZeroCopyStr`. Update the reference to point
    ///
    /// We also update the position of the reference to just after the end of the `str`.
    ///
    /// Panics if the buffer does not hold the proper data.
    pub fn read_from(bytes: &mut &'a [u8]) -> ZeroCopyStr<'a> {
        // Verify bytes at least hold length
        if bytes.len() < LEN_TYPE_SIZE {
            panic!("invalid buffer")
        }

        // Get str length in bytes
        let str_byte_len = LenType::from_le_bytes(array_from_fn::from_fn(|i| bytes[i]));

        // Read str. panics if:
        // 1) out-of-bounds if buffer does not contain enough bytes
        // 2) not valid utf8
        let inner =
            ::core::str::from_utf8(&bytes[LEN_TYPE_SIZE..LEN_TYPE_SIZE + str_byte_len as usize])
                .expect("invalid utf8");

        // Update pointer
        *bytes = &bytes[LEN_TYPE_SIZE + str_byte_len as usize..];

        // Return `ZeroCopyStr`
        ZeroCopyStr { inner }
    }

    /// Total serialized size: str bytes + len bytes
    pub fn serialized_size(&self) -> usize {
        self.inner.as_bytes().len() + LEN_TYPE_SIZE
    }

    /// Returns a view of the bytes of the inner `&str`.
    ///
    /// Note this does not include the bytes of the str length
    pub fn as_bytes(&self) -> &[u8] {
        self.inner.as_bytes()
    }

    /// Returns a view of the inner `&str`
    pub fn as_str(&self) -> &str {
        self.inner
    }

    /// Serializes the str into a vec, in the format specified in this crate.
    pub fn to_vec(&self) -> Vec<u8> {
        let mut buf = vec![0; self.serialized_size()];
        // # SAFETY:
        //
        // The compiler requires the outer lifetime (i.e. the one pointing to the `as_mut_slice`)
        // which is the lifetime of the scope of the method invoked to be as long as the lifetime of
        // the slice which lives for the scope of this function. However, since we are only using this
        // `&'outer mut` to write to the vector, this is irrelevant so we can transmute the outer lifetime.
        let mut buf_cursor = unsafe { ::core::mem::transmute(buf.as_mut_slice()) };
        Self::write_to_update(self.as_str(), &mut buf_cursor);
        buf
    }
}

impl<'a> From<&'a str> for ZeroCopyStr<'a> {
    fn from(value: &'a str) -> Self {
        Self { inner: value }
    }
}

impl<'a> PartialEq<&str> for ZeroCopyStr<'a> {
    fn eq(&self, other: &&str) -> bool {
        self.inner.eq(*other)
    }
}

#[cfg(test)]
mod tests {
    use crate::{LenType, ZeroCopyStr, LEN_TYPE_SIZE};

    // This was the first immutable file stored on sdrive
    // 88 bytes in length
    const SHADOWY_STR: &str =
        "https://shdw-drive.genesysgo.net/2EC2FnYfstrscZDzQcCEgN3hSn1A5wc1pQNKp5DPfCVo/momma.html";

    // Aquaman
    // 125 bytes in length
    const WEAVY_STR: &str =
        "https://4w5qopogxy735ydfrvlfjycvuyho5a2am3g5wtektb3kqmnspl7a.arweave.net/5bsHPca-P77gZY1WVOBVpg7ug0BmzdtMiph2qDGyev4/7500.png";

    // Empty and full strings (0 and 255 bytes), (full is just A repeated)
    const A: u8 = 0x41;
    const EMPTY_STR: &str = "";
    const FULL_STR: &str =
        unsafe { core::str::from_utf8_unchecked(&[A; LenType::MAX as usize]) };

    #[test_case::test_case(SHADOWY_STR; "shadowy file")]
    #[test_case::test_case(WEAVY_STR; "the king aquaman")]
    #[test_case::test_case(EMPTY_STR; "empty str")]
    #[test_case::test_case(FULL_STR; "full str")]
    fn test_round_trip(str: &str) {
        const BUFFER_LEN: usize = 1024;
        let mut buffer = vec![0; BUFFER_LEN];

        // Write str and return
        // 1) ZeroCopyStr pointing to new copy
        // 2) updated pointer
        let (zcs, buffer) = ZeroCopyStr::write_to(str, &mut buffer);

        // Check str written
        assert_eq!(zcs, str);

        // Check pointer was updated
        // (Not a complete check but buf_ref should now be shorter)
        let expected_bytes_written = str.as_bytes().len() + LEN_TYPE_SIZE;
        assert_eq!(BUFFER_LEN, buffer.len() + expected_bytes_written);
    }

    #[test_case::test_case(SHADOWY_STR; "shadowy file")]
    #[test_case::test_case(WEAVY_STR; "the king aquaman")]
    #[test_case::test_case(EMPTY_STR; "empty str")]
    #[test_case::test_case(FULL_STR; "full str")]
    fn test_round_trip_update(str: &str) {
        const BUFFER_LEN: usize = 1024;
        let mut buffer = vec![0; BUFFER_LEN];

        // Write str and return
        // 1) ZeroCopyStr pointing to new copy
        // 2) updated pointer
        let mut buf = buffer.as_mut_slice();
        let zcs = ZeroCopyStr::write_to_update(str, &mut buf);

        // Check str written
        assert_eq!(zcs, str);

        // Check pointer was updated
        // (Not a complete check but buf_ref should now be shorter)
        let expected_bytes_written = str.as_bytes().len() + LEN_TYPE_SIZE;
        assert_eq!(BUFFER_LEN, buf.len() + expected_bytes_written);
    }
}
