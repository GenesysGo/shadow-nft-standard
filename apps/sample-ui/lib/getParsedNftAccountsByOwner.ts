import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js"
import chunks from "lodash.chunk"
import orderBy from "lodash.orderby"

import { Metadata } from "./shadow-nft-standard/accounts/Metadata"
import { PROGRAM_ID } from "./shadow-nft-standard/programId"
import { reconstructUrlFromChainData } from "./utils"

export type StringPublicKey = string

export interface PromiseFulfilledResult<T> {
  status: "fulfilled"
  value: T
}

export interface PromiseRejectedResult {
  status: "rejected"
  reason: any
}

export type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult

enum sortKeys {
  updateAuthority = "updateAuthority",
}

export async function getMetadataAddress(tokenMint: PublicKey) {
  return (
    await PublicKey.findProgramAddressSync([tokenMint.toBuffer()], PROGRAM_ID)
  )[0]
}

export const getParsedNftAccountsByOwner = async ({
  // @ts-ignore
  publicAddress,
  // @ts-ignore
  connection,
  stringifyPubKeys = true,
  sort = true,
  limit = 5000,
}) => {
  const { value: splAccounts } =
    await connection?.getParsedTokenAccountsByOwner(
      new PublicKey(publicAddress),
      {
        programId: new PublicKey(TOKEN_2022_PROGRAM_ID),
      }
    )

  const nftAccounts = splAccounts
    // @ts-ignore
    .filter((t) => {
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals
      return decimals === 0 && amount >= 1
    })
    // @ts-ignore
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint
      return new PublicKey(address)
    })

  const accountsSlice = nftAccounts?.slice(0, limit)

  const metadataAcountsAddressPromises = await Promise.allSettled(
    accountsSlice.map(getMetadataAddress)
  )

  const metadataAccounts = metadataAcountsAddressPromises
    .filter(onlySuccessfullPromises)
    .map((p) => (p as PromiseFulfilledResult<PublicKey>).value)

  // @ts-ignore
  const metaAccountsRawPromises: PromiseSettledResult<
    (AccountInfo<Buffer | ParsedAccountData> | null)[]
  >[] = await Promise.allSettled(
    chunks(metadataAccounts, 99).map((chunk) =>
      Metadata?.fetchMultiple(connection, chunk as PublicKey[])
    )
  )

  const accountsRawMeta = metaAccountsRawPromises
    .filter(({ status }) => status === "fulfilled")
    .flatMap((p) => (p as PromiseFulfilledResult<unknown>).value)
    .filter((x) => x !== null)

  if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
    return []
  }

  const accountsFilteredPromises = accountsRawMeta.map((token) =>
    // @ts-ignore
    stringifyPubKeys ? publicKeyToString(token) : Promise.resolve(token)
  )

  const accountsFiltered = await Promise.all(accountsFilteredPromises)

  if (stringifyPubKeys && sort) {
    const accountsSorted = orderBy(
      accountsFiltered,
      [sortKeys.updateAuthority],
      ["asc"]
    )

    return accountsSorted
  }
  return accountsFiltered
}

const publicKeyToString = async (tokenData: Metadata) => {
  const data = await reconstructUrlFromChainData(tokenData.uri)
  return {
    address: tokenData?.mint?.toString?.(),
    updateAuthority: tokenData?.updateAuthority?.toString?.(),
    image: data?.image,
    name: tokenData?.name,
    description: data?.description,
    attributes: data?.attributes,
  }
}

const onlySuccessfullPromises = (
  result: PromiseSettledResult<unknown>
): boolean => result && result.status === "fulfilled"
