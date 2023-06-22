import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

import { getParsedNftAccountsByOwner } from "@/lib/getParsedNftAccountsByOwner"
import { NFT } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { toast, useToast } from "@/components/ui/use-toast"

export default function IndexPage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const { connection } = useConnection()
  const wallet = useWallet()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (wallet.connected) {
      const fetchData = async () => {
        await fetchNfts()
      }

      fetchData()
    }
  }, [wallet.connected])

  const fetchNfts = async () => {
    try {
      let nfts = await getParsedNftAccountsByOwner({
        publicAddress: wallet.publicKey?.toBase58()!,
        connection,
      })

      // @ts-ignore
      setNfts(nfts)
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong",
        // @ts-ignore
        description: `There was an error fetching your Shadow NFTs. Cause: ${error.message}`,
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
        <h1 className="pb-2 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          My Shadow NFTs
        </h1>
        {!wallet.connected && (
          <h2 className="mt-6 text-2xl font-extrabold">
            Connect your wallet to get started
          </h2>
        )}
        {wallet.connected && (
          <div>
            <div className="flex flex-col items-center"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {loading ? (
                <Spinner /> // or some other loading indicator
              ) : (
                nfts.map((nft) => (
                  <Link href={`/wallet/${nft?.address}`}>
                    <div className="border-secondary flex flex-col items-start justify-center gap-2 rounded-md border">
                      <Image
                        width={500}
                        height={500}
                        src={nft?.image!}
                        alt={nft?.description!}
                        className="rounded-md rounded-b-none"
                      />
                      <div className="px-2 pb-2">
                        <p className="text-lg font-black">{nft?.name}</p>
                        <p>{nft?.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </section>
  )
}
