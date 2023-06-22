//! Unfortunately... I used core::array::from_fn which, although is stable
//! on stable Rust, is not stable with cargo-build-sbf that ships with
//! solana 1.14.18. So, this library will build in stable Rust. Solana 1.16
//! ships with a rust compiler that stabilizes, but until 1.16 is live and
//! compatible with anchor, we are left to use this alternative.
use core::mem::MaybeUninit;

/// A `core::array::from_fn` that we got off wish.com
pub fn from_fn<T, F: FnMut(usize) -> T, const L: usize>(mut f: F) -> [T; L] {
    // Initialize array with uninitialized values
    let mut array: [MaybeUninit<T>; L] = [(); L].map(|_| MaybeUninit::uninit());

    // Initialize values in array
    for i in 0..L {
        array[i].write(f(i));
    }
    // Mark array values as initialized.
    // # SAFETY: we just initialized all `L` items in the loop above.
    
    unsafe { array.map(|ui| ui.assume_init()) }
}

#[test]
fn test_stable_array_from_fn() {
    // Identity
    let result = from_fn(|i| i);
    let expected = [0, 1, 2, 3, 4, 5];
    assert_eq!(result, expected);

    // Some non-identity closure
    let result = from_fn(|i| i * i);
    let expected = [0, 1, 4, 9, 16, 25];
    assert_eq!(result, expected);

    // Some closure which borrows a value from another (Fn)
    let some_other_array = [5, 4, 3, 2, 1];
    let result = from_fn(|i| some_other_array[i]);
    assert_eq!(result, some_other_array);

    // Some closure which moves a value (Fn)
    let some_other_array = [5, 4, 3, 2, 1];
    let result = from_fn(move |i| some_other_array[i]);
    assert_eq!(result, some_other_array);

    // Some closure which mutable borrows values from another (FnMut)
    let mut some_other_array = [5, 4, 3, 2, 1, 0];
    let result = from_fn(|i| {
        some_other_array[i] = i;
        i * i
    });
    let expected_some = [0, 1, 2, 3, 4, 5];
    let expected_result = [0, 1, 4, 9, 16, 25];
    assert_eq!(some_other_array, expected_some);
    assert_eq!(result, expected_result);
}
