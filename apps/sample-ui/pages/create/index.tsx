import { useEffect, useState } from "react"
import Link from "next/link"
import { BN } from "@coral-xyz/anchor"
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token"
import {
  PROGRAM_ID,
  createMetadataAccount,
} from "@genesysgo/shadow-nft-generated-client"
import { UrlFields } from "@genesysgo/shadow-nft-generated-client/dist/src/shadowy-super-minter/types"
import { ShadowDrive } from "@genesysgo/shadow-nft-generated-client/dist/src/shadowy-super-minter/types/Prefix"
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMint2Instruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js"

import {
  fetchCollections,
  fetchGroups,
  getAnchorEnvironment,
  sendAndConfirmTx,
} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

function convertUserUrlToUrlFields(userUrl: string): UrlFields {
  const urlObj = new URL(userUrl)

  // Assume the host is always "shdw-drive.genesysgo.net"
  if (urlObj.host !== "shdw-drive.genesysgo.net") {
    throw new Error("Invalid host in the URL")
  }

  // The pathname should be "/{account}/{object}"
  const pathParts = urlObj.pathname.split("/")
  if (pathParts.length !== 3) {
    throw new Error("Invalid path in the URL")
  }

  // Create a ShadowDrive instance for the prefix
  const prefix = new ShadowDrive({
    account: new PublicKey(pathParts[1]),
  })

  // The object is the last part of the path
  const object = pathParts[2]

  return {
    prefix,
    object,
  }
}

export default function IndexPage() {
  const { toast } = useToast()
  const [isMinting, setMinting] = useState(false)
  const [name, setName] = useState("")
  const [uri, setUri] = useState("")
  const [uriError, setUriError] = useState("")
  const [mutable, setMutable] = useState("true")
  const [collectionKey, setCollectionKey] = useState("")
  const [creatorGroup, setCreatorGroup] = useState("")
  const [fetchedGroups, setFetchedGroups] = useState([])
  const [fetchedCollections, setFetchedCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatorGroupName, setCreatorGroupName] = useState("")
  const [collectionName, setCollectionName] = useState("")

  const { connection } = useConnection()
  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected) {
      const fetchData = async () => {
        await fetchGroups(wallet, connection, setFetchedGroups)
        await fetchCollections(wallet, connection, setFetchedCollections)
        setLoading(false)
      }

      fetchData()
    }
  }, [wallet.connected])

  const create = async () => {
    setMinting(true)
    try {
      // @ts-ignore
      const program = getAnchorEnvironment(wallet, connection, PROGRAM_ID)

      const mint = Keypair.generate()

      // create mint account
      const createIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: await getMinimumBalanceForRentExemptMint(connection),
        programId: TOKEN_2022_PROGRAM_ID,
      })

      const [metadataPDA] = await PublicKey.findProgramAddressSync(
        [mint.publicKey.toBuffer()],
        PROGRAM_ID
      )

      // init mint account
      const initMintIx = createInitializeMint2Instruction(
        mint.publicKey, // mint pubkey
        0, // decimals
        metadataPDA, // mint authority
        null, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        TOKEN_2022_PROGRAM_ID
      )

      const urlFields = convertUserUrlToUrlFields(uri)

      const metadataIx = await createMetadataAccount(
        {
          args: {
            updateAuthority: wallet.publicKey!,
            name,
            uri: urlFields,
            mutable: mutable === "true" ? true : false,
            collectionKey: new PublicKey(collectionKey),
          },
        },
        {
          metadata: metadataPDA,
          creatorGroup: new PublicKey(creatorGroup),
          assetMint: mint.publicKey,
          collection: new PublicKey(collectionKey),
          payerCreator: wallet.publicKey!,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        }
      )

      const minterAta = await getAssociatedTokenAddressSync(
        mint.publicKey,
        wallet.publicKey!,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_PROGRAM_ID
      )

      const mintIx = await program[0].methods
        .mintNft(new BN(1000000))
        .accounts({
          metadata: metadataPDA,
          minter: wallet.publicKey!,
          minterAta,
          assetMint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction()

      await sendAndConfirmTx(
        [createIx, initMintIx, metadataIx, mintIx],
        [wallet, mint],
        connection,
        wallet
      )

      toast({
        title: "Success!",
        description: "Congratulations on creating your Shadow NFT!",
        action: (
          <Link href={`/wallet/${mint.publicKey}`}>
            <ToastAction altText="View Minted NFT">View</ToastAction>
          </Link>
        ),
        // @ts-ignore
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Uh oh! Something went wrong",
        // @ts-ignore
        description: `There was an error creating your Shadow NFT. Cause: ${error.message}`,
        // @ts-ignore
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setMinting(false)
    }
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Create
        </h1>
        <h2 className="mt-6 text-2xl font-extrabold">
          {wallet.connected
            ? "Create a 1/1 Shadow NFT"
            : "Connect your wallet to get started"}
        </h2>
        {wallet.connected && (
          <form className="mt-2 w-full max-w-md space-y-3">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <div className={`items-center ${uriError ? "pb-4" : ""}`}>
              <div className="relative">
                <Input
                  type="text"
                  value={uri}
                  onChange={(e) => {
                    setUri(e.target.value)
                    if (!e.target.value.endsWith(".json")) {
                      setUriError("URI must end with '.json'")
                    } else {
                      setUriError("") // clear error if input ends with '.json'
                    }
                  }}
                  placeholder="URI"
                />
                {uriError && (
                  <div className="absolute top-full my-2 text-xs text-red-500">
                    {uriError}
                  </div>
                )}
              </div>
            </div>
            <Select
              value={collectionKey}
              onValueChange={(selectedKey) => {
                const selectedCollection = fetchedCollections.find(
                  // @ts-ignore
                  (collection) => collection.collectionKey === selectedKey
                )
                setCollectionKey(selectedKey)
                setCollectionName(
                  // @ts-ignore
                  selectedCollection ? selectedCollection.name : ""
                )
              }}
            >
              <SelectTrigger>{collectionName || "Collection"}</SelectTrigger>
              <SelectContent>
                {fetchedCollections.map((collection, index) => (
                  // @ts-ignore
                  <SelectItem key={index} value={collection.collectionKey}>
                    {/* @ts-ignore */}
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={creatorGroup}
              onValueChange={(selectedValue) => {
                const selectedGroup = fetchedGroups.find(
                  // @ts-ignore
                  (group) => group.creatorGroup === selectedValue
                )
                setCreatorGroup(selectedValue)
                // @ts-ignore
                setCreatorGroupName(selectedGroup ? selectedGroup.name : "")
              }}
            >
              <SelectTrigger>
                {creatorGroupName || "Creator Group"}
              </SelectTrigger>
              <SelectContent>
                {fetchedGroups.map((group, index) => (
                  // @ts-ignore
                  <SelectItem key={index} value={group.creatorGroup}>
                    {/* @ts-ignore */}
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <fieldset className="flex flex-col">
              <legend className="mb-2 font-medium">Mutable</legend>
              <div className="flex items-center space-x-3">
                <label>
                  <input
                    type="radio"
                    value="true"
                    checked={mutable === "true"}
                    onChange={(e) => setMutable(e.target.value)}
                  />
                  <span className="ml-2">True</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="false"
                    checked={mutable === "false"}
                    onChange={(e) => setMutable(e.target.value)}
                  />
                  <span className="ml-2">False</span>
                </label>
              </div>
            </fieldset>
            <Button
              onClick={() => {
                create()
              }}
              isLoading={isMinting}
              disabled={isMinting}
            >
              {!isMinting ? "Create" : "Creating..."}
            </Button>
          </form>
        )}
      </div>
      <Toaster />
    </section>
  )
}
