/// <reference types="@solana/web3.js" />
import * as types from "../types";
export interface AssetFields {
    name: string;
    uri: types.UrlFields;
}
export interface AssetJSON {
    name: string;
    uri: types.UrlJSON;
}
export declare class Asset {
    readonly name: string;
    readonly uri: types.Url;
    constructor(fields: AssetFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): types.Asset;
    static toEncodable(fields: AssetFields): {
        name: string;
        uri: {
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
    };
    toJSON(): AssetJSON;
    static fromJSON(obj: AssetJSON): Asset;
    toEncodable(): {
        name: string;
        uri: {
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
    };
}
