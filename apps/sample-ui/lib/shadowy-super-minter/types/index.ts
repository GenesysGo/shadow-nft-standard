import * as Prefix from "./Prefix"
import * as AssetType from "./AssetType"

export { CreateCollectionArgs } from "./CreateCollectionArgs"
export type {
  CreateCollectionArgsFields,
  CreateCollectionArgsJSON,
} from "./CreateCollectionArgs"
export { Url } from "./Url"
export type { UrlFields, UrlJSON } from "./Url"
export { CreateGroupArgs } from "./CreateGroupArgs"
export type {
  CreateGroupArgsFields,
  CreateGroupArgsJSON,
} from "./CreateGroupArgs"
export { Prefix }

/** The common prefix of a `Url`. This is separated since a minter will hold a common prefix. */
export type PrefixKind = Prefix.ShadowDrive | Prefix.Arweave | Prefix.Other
export type PrefixJSON =
  | Prefix.ShadowDriveJSON
  | Prefix.ArweaveJSON
  | Prefix.OtherJSON

export { InitializeArgs } from "./InitializeArgs"
export type { InitializeArgsFields, InitializeArgsJSON } from "./InitializeArgs"
export { Asset } from "./Asset"
export type { AssetFields, AssetJSON } from "./Asset"
export { UniformMint } from "./UniformMint"
export type { UniformMintFields, UniformMintJSON } from "./UniformMint"
export { AssetType }

/**
 * Even though this type has a large in-memory size, it serializes to a small number
 * of bytes when not `AssetType::Other(..)`. Namely, one byte.
 *
 * Useful for nonuniform mints, which may contain many kinds of AssetTypes
 */
export type AssetTypeKind =
  | AssetType.Png
  | AssetType.Jpeg
  | AssetType.Gif
  | AssetType.Mp3
  | AssetType.Mp4
  | AssetType.Other
export type AssetTypeJSON =
  | AssetType.PngJSON
  | AssetType.JpegJSON
  | AssetType.GifJSON
  | AssetType.Mp3JSON
  | AssetType.Mp4JSON
  | AssetType.OtherJSON
