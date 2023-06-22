import { useEffect, useState } from "react"
import * as anchor from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import { fetchCollections, fetchGroups, sendAndConfirmTx } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CreatorGroup, PROGRAM_ID, createCollection } from "@genesysgo/shadow-nft-generated-client"

export default function CreateCollectionPage() {
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [creatorGroupPda, setCreatorGroupPda] = useState("")
  const [royaltyAddresses, setRoyaltyAddresses] = useState([])
  const [royaltyAmounts, setRoyaltyAmounts] = useState([])
  const { toast } = useToast()

  const [fetchedGroups, setFetchedGroups] = useState([])
  const [fetchedCollections, setFetchedCollections] = useState<
    { collectionKey: string; name: string }[]
  >([])
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const { connection } = useConnection()
  const [errors, setErrors] = useState([])
  const wallet = useWallet()
  const [creatorGroupName, setCreatorGroupName] = useState("")

  useEffect(() => {
    if (wallet.connected) {
      const fetchData = async () => {
        await fetchGroups(wallet, connection, setFetchedGroups)
        await fetchCollections(wallet, connection, setFetchedCollections)
        setCollectionLoading(false)
      }

      fetchData()
    }
  }, [wallet.connected])

  const handleCreatorGroupChange = async (value: any) => {
    setCreatorGroupPda(value)

    const addresses = await CreatorGroup.fetch(connection, new PublicKey(value))
    // @ts-ignore
    setRoyaltyAddresses(addresses.creators.map((creator) => creator.toBase58()))
    // @ts-ignore
    setRoyaltyAmounts(new Array(addresses.length).fill(0))
  }

  // @ts-ignore
  const handleRoyaltyAmountChange = (index, newAmount) => {
    // Update royaltyAmounts
    const newAmounts = [...royaltyAmounts]
    // @ts-ignore
    newAmounts[index] = newAmount
    setRoyaltyAmounts(newAmounts)

    // Validate and set errors
    const newErrors = [...errors]
    if (newAmount > 50) {
      // @ts-ignore
      newErrors[index] = "Cannot be higher than 50"
    } else {
      // @ts-ignore
      newErrors[index] = undefined
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setLoading(true)
    try {
      const [collectionPDA] = await PublicKey.findProgramAddressSync(
        [
          new PublicKey(creatorGroupPda).toBuffer(),
          anchor.utils.bytes.utf8.encode(name),
        ],
        PROGRAM_ID
      )

      const doubledRoyaltyAmounts = royaltyAmounts.map((amount) => amount * 2) // Double each value in royaltyAmounts

      let createCollectionIx = createCollection(
        {
          args: {
            name,
            symbol,
            royalty50bps: Buffer.from(doubledRoyaltyAmounts),
            forMinter: false,
          },
        },
        {
          collection: collectionPDA,
          creatorGroup: new PublicKey(creatorGroupPda),
          payerCreator: wallet?.publicKey!,
          systemProgram: SystemProgram.programId,
        }
      )

      await sendAndConfirmTx([createCollectionIx], [wallet], connection, wallet)

      await fetchCollections(wallet, connection, setFetchedCollections)

      toast({
        title: "Success!",
        description: "Your collection has been created successfully.",
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
        description: `There was an error creating your collection. Cause: ${error.message}`,
        // @ts-ignore
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Manage Collections
        </h1>
        <h2 className="mt-6 text-2xl font-extrabold">
          {wallet.connected
            ? "Add a new collection"
            : "Connect your wallet to get started"}
        </h2>
        {wallet.connected && (
          <>
            <form
              onSubmit={handleSubmit}
              className="mt-2 w-full max-w-md space-y-3"
            >
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <Select
                value={creatorGroupPda}
                onValueChange={async (selectedValue) => {
                  await handleCreatorGroupChange(selectedValue)
                  const selectedGroup = fetchedGroups.find(
                    // @ts-ignore
                    (group) => group.creatorGroup === selectedValue
                  )
                  setCreatorGroupPda(selectedValue)
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
              <div>
                {royaltyAddresses.map((address, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center gap-2"
                  >
                    <span className="truncate">{address}</span>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Royalty %"
                        value={royaltyAmounts[index] || ""}
                        onChange={(e) =>
                          handleRoyaltyAmountChange(index, e.target.value)
                        }
                        className="w-full" // allow the input to take up the full width of its grid cell
                      />
                      {errors[index] && (
                        <div className="absolute top-full mt-2 text-xs text-red-500">
                          {errors[index]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                isLoading={loading}
                disabled={!wallet.connected || loading}
              >
                {loading ? "Creating Collection..." : "Create Collection"}
              </Button>
            </form>
            <div className="mt-10 w-full max-w-md">
              {collectionLoading && wallet.connected ? (
                <div className="justify-center">
                  <Spinner />
                </div>
              ) : (
                fetchedCollections?.length > 0 && (
                  <div className="mx-auto w-full max-w-md overflow-auto">
                    <h3 className="mb-6 text-center text-2xl font-extrabold ">
                      Existing Collections
                    </h3>
                    <table className="border-input mx-auto w-full table-auto rounded-md border bg-transparent">
                      <tbody className="text-center">
                        {fetchedCollections.map((data, index) => (
                          <tr key={index}>
                            <td className="break-all border px-4 py-2">
                              {data.collectionKey}
                            </td>
                            <td className="border px-4 py-2">{data.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
      <Toaster />
    </section>
  )
}
