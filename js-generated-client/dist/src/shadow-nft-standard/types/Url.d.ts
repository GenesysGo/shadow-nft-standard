/// <reference types="@solana/web3.js" />
import * as types from "../types";
export interface UrlFields {
    prefix: types.PrefixKind;
    object: string;
}
export interface UrlJSON {
    prefix: types.PrefixJSON;
    object: string;
}
export declare class Url {
    readonly prefix: types.PrefixKind;
    readonly object: string;
    constructor(fields: UrlFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): types.Url;
    static toEncodable(fields: UrlFields): {
        prefix: {
            ShadowDrive: {
                account: import("@solana/web3.js").PublicKey;
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
    toJSON(): UrlJSON;
    static fromJSON(obj: UrlJSON): Url;
    toEncodable(): {
        prefix: {
            ShadowDrive: {
                account: import("@solana/web3.js").PublicKey;
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
}
