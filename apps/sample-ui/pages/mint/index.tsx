import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as anchor from "@coral-xyz/anchor"
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token"
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js"

import { PROGRAM_ID } from "@/lib/shadow-nft-standard/programId"
import { mint } from "@/lib/shadowy-super-minter/instructions"
import { PROGRAM_ID as MINTER_PROGRAM_ID } from "@/lib/shadowy-super-minter/programId"
import { sendAndConfirmTx } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function IndexPage() {
  const { toast } = useToast()
  const [isMinting, setMinting] = useState(false)
  const wallet = useWallet()
  const { connection } = useConnection()

  const mintNft = async () => {
    setMinting(true)
    try {
      const newMint = Keypair.generate()

      const minterAta = await getAssociatedTokenAddressSync(
        newMint.publicKey,
        wallet.publicKey!,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_PROGRAM_ID
      )

      const [metadataPDA] = await PublicKey.findProgramAddressSync(
        [newMint.publicKey.toBuffer()],
        PROGRAM_ID
      )

      const [payerPDA] = await PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("payer_pda"),
          newMint.publicKey.toBuffer(),
        ],
        MINTER_PROGRAM_ID
      )

      const mintIx = mint({
        shadowySuperMinter: new PublicKey(
          process.env.NEXT_PUBLIC_SHADOWY_SUPER_MINTER!
        ),
        minter: wallet.publicKey!,
        payerPda: payerPDA,
        minterAta,
        mint: newMint.publicKey,
        metadata: metadataPDA,
        creatorGroup: new PublicKey(process.env.NEXT_PUBLIC_CREATOR_GROUP!),
        collection: new PublicKey(process.env.NEXT_PUBLIC_COLLECTION_KEY!),
        shadowNftStandard: PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        recentSlothashes: new PublicKey(
          "SysvarS1otHashes111111111111111111111111111"
        ),
        // TODO fix this
        // @ts-ignore
        compute: new PublicKey("ComputeBudget111111111111111111111111111111"),
      })

      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 3000000,
      })

      await sendAndConfirmTx(
        [modifyComputeUnits, mintIx],
        [wallet, newMint],
        connection,
        wallet
      )

      toast({
        title: "Success!",
        description: "Congratulations on minting your Shadow NFT!",
        action: (
          <Link href={`/wallet/${newMint.publicKey}`}>
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
        description: `There was an error minting your Shadow NFT. Cause: ${error.message}`,
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
          Shadow NFT Mint
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg"></p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-center">
          <Image
            src="/hacker_image.png"
            width={500}
            height={500}
            alt="A Shadow NFT minted on the Shadow NFT Standard example UI"
            className="rounded-md"
          />
        </div>
        <div className="flex items-center justify-center">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Mint a Shadow NFT</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div>
                  <p>The first Shadow NFT Collection</p>
                  <p>0 SOL + Txn Fees</p>
                </div>
                <Button
                  onClick={() => {
                    mintNft()
                  }}
                  isLoading={isMinting}
                  disabled={isMinting || !wallet.connected}
                >
                  {!wallet.connected
                    ? "Connect wallet to get started"
                    : !isMinting
                    ? "Mint"
                    : "Minting..."}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </section>
  )
}
