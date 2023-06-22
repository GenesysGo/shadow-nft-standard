import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

import { Metadata } from "@/lib/shadow-nft-standard/accounts"
import { PROGRAM_ID } from "@/lib/shadow-nft-standard/programId"
import { NFT, reconstructUrlFromChainData } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function IndexPage() {
  const router = useRouter()
  const { connection } = useConnection()
  const [nft, setNft] = useState<NFT | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metadataPDA] = await PublicKey.findProgramAddressSync(
          // @ts-ignore
          [new PublicKey(router.query.id).toBuffer()],
          PROGRAM_ID
        )

        const metadata = await Metadata.fetch(connection, metadataPDA)

        // @ts-ignore
        const data = await reconstructUrlFromChainData(metadata.uri)

        // @ts-ignore
        setNft({
          name: data?.name,
          image: data?.image,
          attributes: data?.attributes,
          description: data?.description,
        })
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong",
          // @ts-ignore
          description: `There was an error fetching your Shadow NFT. Cause: ${error.message}`,
          // @ts-ignore
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router.query.id])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          My Shadow NFTs
        </h1>
        <Link
          href={"/wallet"}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Back
        </Link>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-md">
          {loading ? (
            <div className="justify-center">
              <Spinner />
            </div>
          ) : (
            <div>
              <Image
                width={500}
                height={500}
                src={nft?.image!}
                alt={nft?.description!}
                className="rounded-md"
              />
              <div className="px-2 pb-2">
                <p className="text-lg font-black">{nft?.name}</p>
                <p>{nft?.description}</p>
              </div>
              {nft?.attributes && (
                <div className="flex w-full justify-center">
                  <table className="mx-auto my-4 w-full table-auto text-center">
                    <thead>
                      <tr>
                        <th className="px-4 py-1">Trait Type</th>
                        <th className="px-4 py-1">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nft.attributes?.map((attr, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-1">
                            {attr.trait_type}
                          </td>
                          <td className="border px-4 py-1">{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </section>
  )
}
