/// <reference types="node" />
/// <reference types="@solana/web3.js" />
import BN from "bn.js";
import * as types from "../types";
export interface InitializeArgsFields {
    itemsAvailable: number;
    price: BN;
    startTime: BN;
    endTime: BN;
    mintType: types.UniformMintFields;
    ifInitCollection: types.CreateCollectionArgsFields | null;
    ifInitGroupName: string;
}
export interface InitializeArgsJSON {
    itemsAvailable: number;
    price: string;
    startTime: string;
    endTime: string;
    mintType: types.UniformMintJSON;
    ifInitCollection: types.CreateCollectionArgsJSON | null;
    ifInitGroupName: string;
}
export declare class InitializeArgs {
    readonly itemsAvailable: number;
    readonly price: BN;
    readonly startTime: BN;
    readonly endTime: BN;
    readonly mintType: types.UniformMint;
    readonly ifInitCollection: types.CreateCollectionArgs | null;
    readonly ifInitGroupName: string;
    constructor(fields: InitializeArgsFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): types.InitializeArgs;
    static toEncodable(fields: InitializeArgsFields): {
        itemsAvailable: number;
        price: BN;
        startTime: BN;
        endTime: BN;
        mintType: {
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
        ifInitCollection: {
            name: string;
            symbol: string;
            forMinter: boolean;
            royalty50bps: Buffer;
        } | null;
        ifInitGroupName: string;
    };
    toJSON(): InitializeArgsJSON;
    static fromJSON(obj: InitializeArgsJSON): InitializeArgs;
    toEncodable(): {
        itemsAvailable: number;
        price: BN;
        startTime: BN;
        endTime: BN;
        mintType: {
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
        ifInitCollection: {
            name: string;
            symbol: string;
            forMinter: boolean;
            royalty50bps: Buffer;
        } | null;
        ifInitGroupName: string;
    };
}
