use borsh::BorshSerialize;
use zerocopy_str::ZeroCopyStr;

#[derive(BorshSerialize)]
pub enum StrEnum<'a> {
    Png,
    Jpeg,
    Gif,
    Mp3,
    Mp4,
    Other(&'a str), // = OTHER_DISCRIMINANT -- TODO add when stabilized
}

pub enum ZeroCopyStrEnum<'a> {
    Png,
    Jpeg,
    Gif,
    Mp3,
    Mp4,
    Other(ZeroCopyStr<'a>), // = OTHER_DISCRIMINANT -- TODO add when stabilized
}

fn main() {
    let png = StrEnum::Png;
    let other = StrEnum::Other("pdf");
    let other_inner_zc = ZeroCopyStr::from("pdf");

    let png_borsh_bytes = borsh::to_vec(&png).unwrap();
    let png_zc_bytes = vec![0]; // would just write u8 disc
    let other_borsh_bytes = borsh::to_vec(&other).unwrap();
    let other_zc_bytes = [[5].as_ref(), other_inner_zc.to_vec().as_ref()].concat(); // would write u8 disc and then zcstr

    println!("png: {} vs {}", png_borsh_bytes.len(), png_zc_bytes.len());
    println!(
        "other: {} vs {}",
        other_borsh_bytes.len(),
        other_zc_bytes.len()
    );
}
