import { PublicKey } from "@solana/web3.js";
import * as types from "../types";
export interface CreateMetaArgsFields {
    updateAuthority: PublicKey;
    name: string;
    uri: types.UrlFields;
    mutable: boolean;
    collectionKey: PublicKey;
}
export interface CreateMetaArgsJSON {
    updateAuthority: string;
    name: string;
    uri: types.UrlJSON;
    mutable: boolean;
    collectionKey: string;
}
export declare class CreateMetaArgs {
    readonly updateAuthority: PublicKey;
    readonly name: string;
    readonly uri: types.Url;
    readonly mutable: boolean;
    readonly collectionKey: PublicKey;
    constructor(fields: CreateMetaArgsFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): types.CreateMetaArgs;
    static toEncodable(fields: CreateMetaArgsFields): {
        updateAuthority: PublicKey;
        name: string;
        uri: {
            prefix: {
                ShadowDrive: {
                    account: PublicKey;
                };
            } | {
                Arweave: {};
            } | {
                Other: {
                    prefix: string;
                };
            };
            object: string;
        };
        mutable: boolean;
        collectionKey: PublicKey;
    };
    toJSON(): CreateMetaArgsJSON;
    static fromJSON(obj: CreateMetaArgsJSON): CreateMetaArgs;
    toEncodable(): {
        updateAuthority: PublicKey;
        name: string;
        uri: {
            prefix: {
                ShadowDrive: {
                    account: PublicKey;
                };
            } | {
                Arweave: {};
            } | {
                Other: {
                    prefix: string;
                };
            };
            object: string;
        };
        mutable: boolean;
        collectionKey: PublicKey;
    };
}
