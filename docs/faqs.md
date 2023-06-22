# Shadow NFT FAQs

## How much does it cost?
The cost depends on the size of the collection and some of the values used (e.g. name). Here we provide an example for a 10,000 item collection with a 2-member creator group, reasonable values for the variable length fields.

| Account          | Payer              | Approximate Size | Approximate Cost in $SOL |
| ---------------- | ------------------ | ---------------- |--------------------------|
| Creator Group    | Collection Creator | 100 bytes        | 0.00159 ◎                |
| Collection       | Collection Creator | 100 bytes        | 0.00159 ◎                |
| Minter Program   | Collection Creator | 1450 bytes       | 0.0110  ◎                |
| Metadata Account | Minter             | 160 bytes        | 0.00200 ◎                |
| Token Account    | Minter             | 82 bytes         | 0.00146 ◎                |

The totals are thus roughly 
-   Collection Creator(s): 0.1418 ◎
-   Minter: 0.00346 ◎
-   Total (across all 10000 minters): 34.6 ◎

## How do I verify my collection?

Since creating a collection requires a signature from all pubkeys associated with the collection, it is inherently verified. There's no way to fake a creator on a collection.

## How can I mint a NFT without knowing how to code?

1. [Check this quickstart for the Sample UI](docs/sample-ui/quick-start.md)
2. [Check this for documentation of the CLI](cli.md)

## How can I mint a NFT if I'm a coder?

1. Make sure you have rust v1.65.0, anchor v0.27.0 and solana v1.14.18 installed on your machine
2. You can pull in the generated types / IDL files into your typescript project
3. Use the following flow of instructions to go about creating your nft collection!
    1. Create a creator group
    2. Create a collection
    3. Initialize a minter account w/ the JSON & asset files you plan to mint.
    4. Add the .mint() functionality to your app from [the sample ui](../apps/sample-ui/pages/mint/index.tsx)

## Is there a Rust SDK?

Yes.
- For a CPI library, use the `shadow-nft-standard` and `shadowy-super-minter` crates with `features = ["no-entrypoint"].
- For clientside use cases, use the `shadow-nft-sdk` which helps build and sign `Transaction`s for all the relevant instructions.

## Is there a CLI?

Yes. Check out `shadow-drive-cli`, which has been updated to include both shadow drive and shadow nft commands. You can manage storage, creator groups, collections, nfts, all with one cli!

## FAQ not listed?

Please open an issue with a question or a pull request with a question/answer combo you feel should be added to the FAQs!
