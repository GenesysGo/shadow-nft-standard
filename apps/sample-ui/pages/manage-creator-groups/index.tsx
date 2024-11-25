import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { sha256 } from "js-sha256"

import { fetchGroups, hexToBytes, sendAndConfirmTx } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CreatorGroup, PROGRAM_ID, createGroup } from "@genesysgo/shadow-nft-generated-client"

export default function IndexPage() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()
  const [inputFields, setInputFields] = useState([
    { name: "Creator 1", value: "" },
  ])
  const [creatorGroupAddress, setCreatorGroupAddress] = useState("")
  const [name, setName] = useState("")
  const [fetchedData, setFetchedData] = useState([])
  const [loading, setLoading] = useState(false)
  const [creatorGroupLoading, setCreatorGroupLoading] = useState(true)
  const [verifyLoading, setVerifyLoading] = useState(false)

  useEffect(() => {
    if (wallet.connected) {
      const fetchData = async () => {
        await fetchGroups(wallet, connection, setFetchedData)
        setCreatorGroupLoading(false)
      }

      fetchData()
    }
  }, [wallet.connected])

  useEffect(() => {
    if (wallet?.publicKey) {
      const values = [...inputFields]
      // @ts-ignore
      values[0].value = wallet.publicKey.toBase58()
      setInputFields(values)
    }
  }, [wallet?.publicKey])

  // @ts-ignore
  const handleInputChange = (index, event) => {
    const values = [...inputFields]
    values[index].value = event.target.value
    setInputFields(values)
  }

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { name: `Creator ${inputFields.length + 1}`, value: "" },
    ])
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setLoading(true)
    try {
      const newPubkeys = inputFields.map(
        (inputField) => new PublicKey(inputField.value)
      )

      let sortedPubkeys = [...newPubkeys].sort((a, b) => {
        const bufferA = Buffer.from(a.toBytes())
        const bufferB = Buffer.from(b.toBytes())

        return bufferA.compare(bufferB)
      })

      let seedGen = sha256.create()

      // Digest all creators
      for (let creator of sortedPubkeys) {
        // Update the hash with each creator
        seedGen.update(creator.toBytes())
      }

      const hex = seedGen.hex()

      const finalized = hexToBytes(hex)

      const [creatorGroupPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from(finalized)],
        PROGRAM_ID
      )

      const createGroupIx = await createGroup(
        {
          args: {
            name,
          },
        },
        {
          creatorGroup: creatorGroupPDA,
          // @ts-ignore
          creator: wallet?.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )

      createGroupIx.keys = createGroupIx.keys.concat(
        newPubkeys
          .slice(1)
          .map((pubkey) => ({ pubkey, isSigner: false, isWritable: false }))
      )

      await sendAndConfirmTx([createGroupIx], [wallet], connection, wallet)

      await fetchGroups(wallet, connection, setFetchedData)

      toast({
        title: "Success!",
        description: "Your creator group has been created successfully.",
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
        description: `There was an error creating your creator group. Cause: ${error.message}`,
        // @ts-ignore
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyCreator = async () => {
    setVerifyLoading(true)
    try {
      const creatorGroupInfo = await CreatorGroup.fetch(
        connection,
        new PublicKey(creatorGroupAddress)
      )

      const createGroupIx = await createGroup(
        {
          args: {
            name: creatorGroupInfo?.name!,
          },
        },
        {
          creatorGroup: new PublicKey(creatorGroupAddress),
          // @ts-ignore
          creator: wallet?.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )

      createGroupIx.keys = createGroupIx.keys.concat(
        // @ts-ignore
        creatorGroupInfo?.creators
          .filter((pubkey) => !pubkey.equals(wallet.publicKey!))
          .map((pubkey) => ({ pubkey, isSigner: false, isWritable: false }))
      )

      await sendAndConfirmTx([createGroupIx], [wallet], connection, wallet)

      toast({
        title: "Success!",
        description:
          "Your creator group has successfully verified your address.",
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
        description: `There was an error verifying your address in the creator group. Cause: ${error.message}`,
        // @ts-ignore
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Manage Creator Groups
        </h1>
        <h2 className="mt-6 text-2xl font-extrabold">
          {wallet.connected
            ? "Add a new creator group"
            : "Connect your wallet to get started"}
        </h2>
        {wallet.connected && (
          <>
            <form
              onSubmit={handleSubmit}
              className="mt-2 w-full max-w-md space-y-3"
            >
              {inputFields.map((inputField, index) => (
                <div key={`${inputField.name}-${index}`} className="mt-3">
                  <Input
                    className="text-center"
                    type="text"
                    placeholder={inputField.name}
                    value={inputField.value}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              ))}
              <Input
                type="text"
                className="mt-2 text-center"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="mt-3 flex flex-col justify-between space-y-3 sm:flex-row sm:space-y-0">
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={!wallet.connected || loading}
                >
                  {loading
                    ? "Creating Creator Group..."
                    : "Create Creator Group"}
                </Button>
                <Button type="button" onClick={() => handleAddFields()}>
                  Add additional creator
                </Button>
              </div>
            </form>
            <h2 className="mt-6 text-2xl font-extrabold">
              Verify creator group
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mt-2 w-full max-w-md space-y-3"
            >
              <Input
                className="text-center"
                type="text"
                placeholder={"Creator Group Address"}
                value={creatorGroupAddress}
                onChange={(e) => setCreatorGroupAddress(e.target.value)}
              />

              <div className="mt-3 flex flex-col justify-between space-y-3 sm:flex-row sm:space-y-0">
                <Button
                  onClick={() => {
                    verifyCreator()
                  }}
                  isLoading={verifyLoading}
                  disabled={!wallet.connected || verifyLoading}
                >
                  {verifyLoading
                    ? "Verifying Creator Group..."
                    : "Verify Creator Group"}
                </Button>
              </div>
            </form>
            <div className="mt-10 w-full max-w-md">
              {creatorGroupLoading && wallet.connected ? (
                <div className="justify-center">
                  <Spinner />
                </div>
              ) : (
                fetchedData?.length > 0 && (
                  <div className="mx-auto w-full max-w-md overflow-auto">
                    <h3 className="mb-6 text-center text-2xl font-extrabold">
                      Existing Creator Groups
                    </h3>
                    <table className="border-input mx-auto w-full table-auto rounded-md border bg-transparent">
                      <tbody className="text-center">
                        {fetchedData.map((data, index) => (
                          <tr key={index}>
                            <td className="break-all border px-4 py-2">
                              {/* @ts-ignore */}
                              {data.creatorGroup}
                            </td>
                            <td className="border px-4 py-2">
                              {/* @ts-ignore */}
                              {data.name}
                            </td>
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
