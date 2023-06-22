use std::fmt::Display;

pub use anchor_lang::*;
use shadow_nft_common::array_from_fn::from_fn;

#[derive(Debug, Clone, PartialEq, Copy)]
#[repr(u8)]
/// Even though this type has a large in-memory size, it serializes to a small number
/// of bytes when not `AssetType::Other(..)`. Namely, one byte.
///
/// Useful for nonuniform mints, which may contain many kinds of AssetTypes
pub enum AssetType<'a> {
    Png,
    Jpeg,
    Gif,
    Mp3,
    Mp4,
    Other { other: &'a str }, // = OTHER_DISCRIMINANT -- TODO change to u8::MAX when stabilized
}
// TODO change to u8::MAX when stabilized
pub const OTHER_DISCRIMINANT: u8 = 5;

/// The type used to encode the length of the inner str
type LenType = u8;
const LEN_TYPE_SIZE: usize = ::core::mem::size_of::<LenType>();
const TYPE_SIZE: usize = ::core::mem::size_of::<AssetType>();

impl<'a> AssetType<'a> {
    const fn discriminant(&self) -> u8 {
        unsafe { *(self as *const Self as *const u8) }
    }

    pub fn write_to_update<'o>(self, buf: &'o mut &'a mut [u8]) {
        let mut bytes_written = 0;
        match self {
            Self::Other { other } => {
                // Check space for discriminant, length (u8), and bytes
                if buf.len() < 1 + LEN_TYPE_SIZE + other.as_bytes().len() {
                    panic!("not enough space for other variant");
                }

                // Write discriminant, length, bytes
                for (i, &b) in [
                    &[self.discriminant()],
                    &(other.as_bytes().len() as LenType).to_le_bytes(),
                    other.as_bytes(),
                ]
                .into_iter()
                .flatten()
                .enumerate()
                {
                    buf[i] = b;
                    bytes_written += 1;
                }
            }
            _ => {
                if buf.is_empty() {
                    panic!("no space to write discriminant");
                }
                buf[0] = self.discriminant();
                bytes_written += 1;
            }
        }

        // Update pointer
        //
        // # SAFETY :
        //
        // The compiler requires the outer lifetime (i.e. the one pointing to the mut slice)
        // to be as long as the lifetime of the mutable reference to the mut slice. However, the inner
        // `&'a mut` remains a valid mutable reference after the outer reference is dropped.
        let (_written_bytes, rest) = unsafe {
            ::core::mem::transmute::<(&'o mut [u8], &'o mut [u8]), (&'a mut [u8], &'a mut [u8])>(
                buf.split_at_mut(bytes_written),
            )
        };
        *buf = rest;
    }

    /// Deserializes a `Type<'a>` which exists at the beginning of a byte slice.
    ///
    /// If an Other variant was serialized via `to_bytes` then this should never panic. However,
    /// if this points to another variant with an invalid str len or content then it may panic.
    ///
    /// # SAFETY
    /// It is the caller's responsibility to ensure the `&[u8]` is pointing to the start of a `Type<'a>`.
    #[must_use]
    pub unsafe fn from_bytes(bytes: &mut &'a [u8]) -> AssetType<'a> {
        // Read discriminant
        match bytes[0] {
            OTHER_DISCRIMINANT => {
                // Decode length
                let str_len: LenType = LenType::from_le_bytes(from_fn(|i| bytes[1 + i]));

                // Read str
                let start = 1 + LEN_TYPE_SIZE;
                let end = 1 + LEN_TYPE_SIZE + str_len as usize;
                let str_content: &str = core::str::from_utf8(&bytes[start..end]).unwrap();

                // Update pointer
                let rest = bytes.split_at(end).1;
                *bytes = rest;

                AssetType::Other { other: str_content }
            }
            x => {
                const EMPTY: [u8; TYPE_SIZE] = [0; TYPE_SIZE];
                let mut ty_bytes = EMPTY;
                ty_bytes[0] = x;

                // This is really the only unsafe bit. If a discriminant which does not exists is given this Type will be nonsensical
                let ty: AssetType = std::mem::transmute(ty_bytes);

                // Update pointer
                let rest = bytes.split_at(1).1;
                *bytes = rest;

                ty
            }
        }
    }

    /// Appends the extension to form the complete asset name, e.g. 1.jpeg
    #[inline(always)]
    pub fn name<N: Display>(&self, name: N) -> String {
        format!("{name}{}", self.ext())
    }

    #[inline(always)]
    pub fn ext(&self) -> &str {
        match self {
            AssetType::Other { other } => other,
            AssetType::Jpeg => ".jpeg",
            AssetType::Png => ".png",
            AssetType::Gif => ".gif",
            AssetType::Mp3 => ".mp3",
            AssetType::Mp4 => ".mp4",
        }
    }
}

#[test]
fn test_ser_de_assettype() {
    let mut buffer = [0_u8; 100];
    let mut buf_cursor = buffer.as_mut_slice();

    // Write these types to a buffer
    const TEST_TYPES: &[AssetType] = &[
        AssetType::Png,
        AssetType::Jpeg,
        AssetType::Gif,
        AssetType::Mp3,
        AssetType::Mp4,
        AssetType::Other { other: "" },
        AssetType::Other { other: "pdf" },
        AssetType::Other { other: "xdf" },
    ];
    const NUM_TEST_TYPES: usize = TEST_TYPES.len();

    for ty in TEST_TYPES {
        ty.write_to_update(&mut buf_cursor);
    }
    drop(buf_cursor);

    // Read these types
    let mut buf_cursor = buffer.as_slice();
    let types_desered: [AssetType; NUM_TEST_TYPES] =
        ::core::array::from_fn(|_| unsafe { AssetType::from_bytes(&mut buf_cursor) });

    assert_eq!(TEST_TYPES, types_desered);
}
