/// <reference types="@solana/web3.js" />
import * as types from "../types";
export interface UniformMintFields {
    revealHash: Array<number>;
    namePrefix: string;
    prefixUri: types.PrefixKind;
}
export interface UniformMintJSON {
    revealHash: Array<number>;
    namePrefix: string;
    prefixUri: types.PrefixJSON;
}
export declare class UniformMint {
    readonly revealHash: Array<number>;
    readonly namePrefix: string;
    readonly prefixUri: types.PrefixKind;
    constructor(fields: UniformMintFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): types.UniformMint;
    static toEncodable(fields: UniformMintFields): {
        revealHash: number[];
        namePrefix: string;
        prefixUri: {
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
    };
    toJSON(): UniformMintJSON;
    static fromJSON(obj: UniformMintJSON): UniformMint;
    toEncodable(): {
        revealHash: number[];
        namePrefix: string;
        prefixUri: {
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
    };
}
