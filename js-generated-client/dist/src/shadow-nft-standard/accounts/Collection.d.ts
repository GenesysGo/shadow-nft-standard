/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
import * as types from "../types";
export interface CollectionFields {
    creatorGroupKey: PublicKey;
    size: number;
    sigs: number;
    forMinter: boolean;
    royalty50bps: Array<number>;
    symbol: types.SymbolFields;
    name: string;
}
export interface CollectionJSON {
    creatorGroupKey: string;
    size: number;
    sigs: number;
    forMinter: boolean;
    royalty50bps: Array<number>;
    symbol: types.SymbolJSON;
    name: string;
}
export declare class Collection {
    readonly creatorGroupKey: PublicKey;
    readonly size: number;
    readonly sigs: number;
    readonly forMinter: boolean;
    readonly royalty50bps: Array<number>;
    readonly symbol: types.Symbol;
    readonly name: string;
    static readonly discriminator: Buffer;
    static readonly layout: any;
    constructor(fields: CollectionFields);
    static fetch(c: Connection, address: PublicKey, programId?: PublicKey): Promise<Collection | null>;
    static fetchMultiple(c: Connection, addresses: PublicKey[], programId?: PublicKey): Promise<Array<Collection | null>>;
    static decode(data: Buffer): Collection;
    toJSON(): CollectionJSON;
    static fromJSON(obj: CollectionJSON): Collection;
}
