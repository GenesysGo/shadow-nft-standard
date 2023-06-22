/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
import * as types from "../types";
export interface MetadataFields {
    mint: PublicKey;
    updateAuthority: PublicKey;
    collectionKey: PublicKey;
    postPrimary: boolean;
    mutable: boolean;
    name: string;
    uri: types.UrlFields;
}
export interface MetadataJSON {
    mint: string;
    updateAuthority: string;
    collectionKey: string;
    postPrimary: boolean;
    mutable: boolean;
    name: string;
    uri: types.UrlJSON;
}
export declare class Metadata {
    readonly mint: PublicKey;
    readonly updateAuthority: PublicKey;
    readonly collectionKey: PublicKey;
    readonly postPrimary: boolean;
    readonly mutable: boolean;
    readonly name: string;
    readonly uri: types.Url;
    static readonly discriminator: Buffer;
    static readonly layout: any;
    constructor(fields: MetadataFields);
    static fetch(c: Connection, address: PublicKey, programId?: PublicKey): Promise<Metadata | null>;
    static fetchMultiple(c: Connection, addresses: PublicKey[], programId?: PublicKey): Promise<Array<Metadata | null>>;
    static decode(data: Buffer): Metadata;
    toJSON(): MetadataJSON;
    static fromJSON(obj: MetadataJSON): Metadata;
}
