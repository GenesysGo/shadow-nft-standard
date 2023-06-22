//! Work-In-Progress
pub struct NonUniformMint<'a> {
    pub reveal_hash: [u8; 32],
    pub name_prefix: ZeroCopyStr<'a>,
    pub prefix_uri: Prefix,
    pub extensions: &'a [(AssetType<'a>, u32)],
}

impl<'a> NonUniformMint<'a> {
    pub fn write_to_update<'o>(self, buf: &'o mut &'a mut [u8]) {
        // Check if there is enough space in the buffer
        let byte_len = self.required_space();

        // TODO: write
        self.prefix_uri.try_to_vec();

        // Update pointer
        let (_written_bytes, rest) = unsafe {
            ::core::mem::transmute::<(&'o mut [u8], &'o mut [u8]), (&'a mut [u8], &'a mut [u8])>(
                buf.split_at_mut(byte_len),
            )
        };
        *buf = rest;
    }

    pub fn required_space(&self) -> usize {
        let NonUniformMint {
            ref reveal_hash,
            ref name_prefix,
            ref prefix_uri,
            ref extension,
        } = self;

        // Initialize space with hash len
        let mut space = reveal_hash.len();

        // Add prefix len
        space += name_prefix.serialized_size();

        // Add prefix uri size
        space += prefix_uri.serialized_size();
    }
}
