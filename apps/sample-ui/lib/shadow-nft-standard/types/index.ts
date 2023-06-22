import * as SymbolError from "./SymbolError"
import * as Prefix from "./Prefix"

export { Symbol } from "./Symbol"
export type { SymbolFields, SymbolJSON } from "./Symbol"
export { Url } from "./Url"
export type { UrlFields, UrlJSON } from "./Url"
export { CreateCollectionArgs } from "./CreateCollectionArgs"
export type {
  CreateCollectionArgsFields,
  CreateCollectionArgsJSON,
} from "./CreateCollectionArgs"
export { CreateGroupArgs } from "./CreateGroupArgs"
export type {
  CreateGroupArgsFields,
  CreateGroupArgsJSON,
} from "./CreateGroupArgs"
export { CreateMetaArgs } from "./CreateMetaArgs"
export type { CreateMetaArgsFields, CreateMetaArgsJSON } from "./CreateMetaArgs"
export { UpdateMetaArgs } from "./UpdateMetaArgs"
export type { UpdateMetaArgsFields, UpdateMetaArgsJSON } from "./UpdateMetaArgs"
export { SymbolError }

export type SymbolErrorKind =
  | SymbolError.InvalidAscii
  | SymbolError.IncorrectCaseOrInvalidCharacters
  | SymbolError.ExceedsMaxLength
export type SymbolErrorJSON =
  | SymbolError.InvalidAsciiJSON
  | SymbolError.IncorrectCaseOrInvalidCharactersJSON
  | SymbolError.ExceedsMaxLengthJSON

export { Prefix }

/** The common prefix of a `Url`. This is separated since a minter will hold a common prefix. */
export type PrefixKind = Prefix.ShadowDrive | Prefix.Arweave | Prefix.Other
export type PrefixJSON =
  | Prefix.ShadowDriveJSON
  | Prefix.ArweaveJSON
  | Prefix.OtherJSON
