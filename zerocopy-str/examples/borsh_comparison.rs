use borsh::{BorshDeserialize, BorshSerialize};
use zerocopy_str::ZeroCopyStr;

type DataType = u8;
const TWO_DATA_LEN: usize = 2 * ::core::mem::size_of::<DataType>();

#[derive(Debug, BorshSerialize, BorshDeserialize)]
struct BorshStruct {
    // Common fields
    data: DataType,
    more_data: DataType,

    // Fields that differ
    name: String,
    prefix: String,
    object: String,
}

#[derive(Debug, BorshSerialize, BorshDeserialize)]
struct ZeroCopyStrStruct<'a> {
    // Common fields
    data: DataType,
    more_data: DataType,

    // Fields that differ
    name: ZeroCopyStr<'a>,
    prefix: ZeroCopyStr<'a>,
    object: ZeroCopyStr<'a>,
}

const DATA: DataType = 123;
const MORE_DATA: DataType = 231;
const NAME: &str = "asdf";
const PREFIX: &str =
    "https://shdw-drive.genesysgo.net/9Z1rHX9qmAvQvAXC1Cq3oCA9qS7Xm7KWEJWMQ3KbZvVu";
const OBJECT: &str = "Final.mp4";

fn main() {
    // Serialize a struct with borsh and measure bytes
    let bs = BorshStruct {
        data: DATA,
        more_data: MORE_DATA,
        name: NAME.to_string(),
        prefix: PREFIX.to_string(),
        object: OBJECT.to_string(),
    };
    let borsh_bytes = borsh::to_vec(&bs).unwrap();
    println!("borsh struct serialized to {} bytes", borsh_bytes.len());

    // Serialize a struct w/ ZeroCopyStr and measure bytes
    const BUFFER_LEN: usize = 256;
    let mut full_buffer: [u8; BUFFER_LEN] = [0; BUFFER_LEN];
    let buffer = write_to(&mut full_buffer, DATA.to_le_bytes().as_ref());
    let mut buffer = write_to(buffer, MORE_DATA.to_le_bytes().as_ref());
    let name = ZeroCopyStr::write_to_update(NAME, &mut buffer);
    let prefix = ZeroCopyStr::write_to_update(PREFIX, &mut buffer);
    let object = ZeroCopyStr::write_to_update(OBJECT, &mut buffer);
    // Additionally, ensure everything was written properly
    let zc_bytes_written = BUFFER_LEN - buffer.len();
    assert_eq!(name, NAME);
    assert_eq!(prefix, PREFIX);
    assert_eq!(object, OBJECT);
    // Can also deser again
    let mut deser_buffer = &full_buffer[TWO_DATA_LEN..];
    let name_deser = ZeroCopyStr::read_from(&mut deser_buffer);
    let prefix_deser = ZeroCopyStr::read_from(&mut deser_buffer);
    let object_deser = ZeroCopyStr::read_from(&mut deser_buffer);
    assert_eq!(name_deser, NAME);
    assert_eq!(prefix_deser, PREFIX);
    assert_eq!(object_deser, OBJECT);
    // Report results
    println!("zc struct serialized to {} bytes", zc_bytes_written);

    // Report comparison
    let byte_diff = borsh_bytes.len() - zc_bytes_written;
    let byte_diff_percentage = byte_diff as f64 * 100.0 / borsh_bytes.len() as f64;
    println!("A reduction of {byte_diff} bytes ({byte_diff_percentage:.2}%)");

    // Compare single strings
    let string = OBJECT.to_string();
    let zcstr = object_deser;
    let borsh_string_bytes = borsh::to_vec(&string).unwrap();
    let zc_string_bytes = zcstr.to_vec();
    println!(
        "string {} vs zcstr {}",
        borsh_string_bytes.len(),
        zc_string_bytes.len()
    );
}

/// mini helper function do not use elsewhere
fn write_to<'a>(buffer: &'a mut [u8], value: &[u8]) -> &'a mut [u8] {
    let val_bytes = value.len();
    buffer[..val_bytes].copy_from_slice(value);
    &mut buffer[val_bytes..]
}
