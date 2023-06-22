use borsh::BorshSerialize;

#[derive(BorshSerialize)]
#[repr(u8)]
pub enum Thing1 {
    A([u8; 32]),
    B(String),
}

#[derive(BorshSerialize)]
#[repr(u32)]
pub enum Thing2 {
    A([u8; 32]),
    B(String),
}

fn main() {
    let thing1 = Thing1::A([0; 32]);
    let thing12 = Thing1::B("asdf".to_string());
    let thing2 = Thing2::A([0; 32]);
    let thing22 = Thing2::B("asdf".to_string());

    let bytes1 = borsh::to_vec(&thing1).unwrap();
    let bytes2 = borsh::to_vec(&thing2).unwrap();

    println!("thing1: {}", bytes1.len());
    println!("thing2: {}", bytes2.len());

    let bytes1 = borsh::to_vec(&thing12).unwrap();
    let bytes2 = borsh::to_vec(&thing22).unwrap();

    println!("thing12: {}", bytes1.len());
    println!("thing22: {}", bytes2.len());
}
