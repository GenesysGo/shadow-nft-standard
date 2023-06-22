# Shadow NFT Quick Start for 1/1 minting in the Sample UI

The following steps are a quick "getting started" guide for how to use the Shadow NFT Standard.

1. Create your image file or other asset type you want to create a 1/1 nft from
2. Create a JSON file that conforms to the following format: https://docs.metaplex.com/programs/token-metadata/token-standard#the-non-fungible-standard
    - Make sure you add the final image url where it will be uploaded and available in the json file
3. Upload your JSON metadata file and image file to your storage provider of your choice. https://docs.shadow.cloud/build/community-maintained-uis is a good start 😊
4. Copy the URL for the JSON metadata file you uploaded, you'll need this for later!
5. In the sample UI, go to "Manage Creator Groups", make sure your wallet is connected, and then click "Submit" to create your creator group.
    - If you're adding multiple creators to your creator group, you will need to send the creator group address to each member of the group for them to submit a `create creator group` request from their wallets as well. Until all members sign, the creator group cannot move forward with creating a collection.
6. Next, go to "Manage Collections" and enter the name and what symbol you'd like to represent your 1/1 nft on chain. Select the creator group you just made in step 5, and then click "Submit".
7. Finally, click on "Create" and enter the name you want to give your specific 1/1 nft on chain, paste the JSON metadata URI in the "URI" input field, select if you want your 1/1 NFT to be Mutable or Immutable, select the "Collection" you created in step 6, and then the "Creator Group" should be selected automatically. From there, click "Create" and wait for the transaction to submit!
8. If all goes according to plan, you should get a success notification in the bottom-right of your screen. You can either click the button in that notification or click "View NFTs" to view all the Shadow NFTs you've minted or currently hold in your wallet.
