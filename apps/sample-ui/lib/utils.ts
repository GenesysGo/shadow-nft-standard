import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { PROGRAM_ID } from "@genesysgo/shadow-nft-generated-client"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ShadowNftStandard, IDL as StandardIDL } from "./standard-idl"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAnchorEnvironment(
  wallet: AnchorWallet,
  connection: anchor.web3.Connection,
  programAddress: string
): [Program<ShadowNftStandard>, anchor.Provider] {
  const provider = new anchor.AnchorProvider(connection, wallet, {})
  anchor.setProvider(provider)
  const program: Program<ShadowNftStandard> = new anchor.Program(
    StandardIDL,
    new PublicKey(programAddress)
  )

  return [program, provider]
}

export async function confirmTx(txHash: string, connection: any) {
  const blockhashInfo = await connection.getLatestBlockhash()
  await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  })
}

export async function sendAndConfirmTx(
  ixs: TransactionInstruction[],
  signers: any[],
  connection: any,
  wallet: any
) {
  const blockhashInfo = await connection.getLatestBlockhash()
  let tx = new Transaction().add(...ixs)
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = blockhashInfo.blockhash

  if (signers.length > 1) {
    tx.sign(signers[1])
  }
  tx = await signers[0].signTransaction(tx)

  // tx.partialSign(...signers)
  const txHash = await connection.sendRawTransaction(tx.serialize())
  await confirmTx(txHash, connection)

  return txHash
}

export function hexToBytes(hex: string): Uint8Array {
  let bytes = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

export async function reconstructUrlFromChainData(url: any) {
  // Ensure the prefix is of the correct type
  if (url.prefix.kind !== "ShadowDrive") {
    throw new Error("Invalid prefix type")
  }

  // Construct the URL string
  const urlString = `https://shdw-drive.genesysgo.net/${url.prefix.value.account.toString()}/${
    url.object
  }`

  let data
  try {
    const response = await fetch(urlString)
    data = await response.json()
  } catch (error) {
    // Handle any errors here
    console.error(error)
  }

  return data
}

export interface Attribute {
  trait_type: string
  value: string
}

export interface NFT {
  address?: string
  image?: string
  description?: string
  name?: string
  attributes?: Attribute[]
}

export const fetchGroups = async (
  wallet: any,
  connection: any,
  setFetchedGroups: any
) => {
  // @ts-ignore
  const [program] = getAnchorEnvironment(wallet, connection, PROGRAM_ID)

  const creatorGroupKeys = await program.account.creatorGroup.all()

  const keys = await Promise.all(
    creatorGroupKeys.map(async (creatorGroupKey) => {
      const creatorGroup = await program.account.creatorGroup.fetch(
        creatorGroupKey.publicKey
      )
      const creator = creatorGroup.creators.find(
        (x) => x.toBase58() === wallet.publicKey?.toBase58()
      )

      if (creator) {
        // If the creator is found, return an object containing the publicKey, name, and symbol
        return {
          creatorGroup: creatorGroupKey.publicKey.toBase58(),
          name: creatorGroup.name,
        }
      } else {
        // If the creator is not found, return null
        return null
      }
    })
  )

  // @ts-ignore
  setFetchedGroups(keys.filter(Boolean))
}

export const fetchCollections = async (
  wallet: any,
  connection: any,
  setFetchedCollections: any
) => {
  // @ts-ignore
  const [program] = getAnchorEnvironment(wallet, connection, PROGRAM_ID)

  const collectionKeys = await program.account.collection.all()

  const collections = await Promise.all(
    collectionKeys.map(async (collectionKey) => {
      const collection = await program.account.collection.fetch(
        collectionKey.publicKey
      )
      const creatorGroup = await program.account.creatorGroup.fetch(
        collection.creatorGroupKey
      )
      const creator = creatorGroup.creators.find(
        (x) => x.toBase58() === wallet.publicKey?.toBase58()
      )

      if (creator) {
        // If the creator is found, return an object containing the publicKey, name, and symbol
        return {
          collectionKey: collectionKey.publicKey.toBase58(),
          name: collection.name,
        }
      } else {
        // If the creator is not found, return null
        return null
      }
    })
  )

  // @ts-ignore
  setFetchedCollections(collections.filter(Boolean))
}
