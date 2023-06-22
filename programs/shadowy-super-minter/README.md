All in all, the minter (TODO: name) account looks like

| ID | Field | Offset | Size| Description |
|----| ------|--------|-----|-------------|
|1 | discriminator | 0|	8 |	Anchor account discriminator. |
|5 |creator_group|	16|	32|	PubKey of the authority address that controls the minter.|
|7 |collection|	80|	32|	PubKey of the shadow-nft-standard collection account; each NFT minted from the minter will be part of this collection.|
|8 |items_redeemed|	112|	8|	Number of NFTs minted.|
|9 |			`MinterArgs`|
|10|items_available|	120|	8|	Total number of NFTs available.|

Then, either
| ID | Field | Offset | Size| Description |
|----| ------|--------|-----|-------------|
|   `UniformMint` |
|1	|`name_prefix`|	0|	64|	common part of name, e.g. `"Shadowy Super Coders"`
|2	|name_length|	64|	1|	u8 specifying the number of bytes for the remaining part of the name.|
|3	|hash|	65 |	32|	string representing the hash value of the file that contains the mapping of (mint index, NFT metadata).|
|4	|prefix_uri_enum|	87 |	TBD|	enum representing the common part of the URI of NFTs.|
|5	|suffix_uri_enum|	TBD|	TBD|	u32 specifying the number of bytes for the remaining part of the URI.|
|6 | `TypeEnum` | TBD | TBD| enum tracking the common type of the assets in the minter|
|7 | `BitVec` | ~ | ~ | bit vector marking which assets have been minted |
or
| ID | Field | Offset | Size| Description |
|----| ------|--------|-----|-------------|
|   `NonUniformMint` |
|1	|`name_prefix`|	0|	64|	common part of name, e.g. `"Shadowy Super Coders"`
|2	|name_length|	64|	1|	u8 specifying the number of bytes for the remaining part of the name.|
|3	|hash|	65 |	32|	string representing the hash value of the file that contains the mapping of (mint index, NFT metadata).|
|4	|prefix_uri_enum|	87 |	TBD|	enum representing the common part of the URI of NFTs.|
|6 | `[(TypeEnum, u32)]` | TBD | TBD| raw unsized type tracking which item `id: u32` is of which type `TypeEnum`|
|7 | `BitVec` | ~ | ~ | bit vector marking which assets have been minted |


 --- 
 June 11: New iteration on `UniformMint`. Since we are using the `zerocopy-bitslice` library for generating random sequences at runtime, we don't need a proof of randomness although we do need a reveal map proof. So, rename `hash` to `reveal_hash`.