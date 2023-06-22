/// <reference types="node" />
export interface CreateCollectionArgsFields {
    name: string;
    symbol: string;
    forMinter: boolean;
    royalty50bps: Uint8Array;
}
export interface CreateCollectionArgsJSON {
    name: string;
    symbol: string;
    forMinter: boolean;
    royalty50bps: Array<number>;
}
export declare class CreateCollectionArgs {
    readonly name: string;
    readonly symbol: string;
    readonly forMinter: boolean;
    readonly royalty50bps: Uint8Array;
    constructor(fields: CreateCollectionArgsFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): CreateCollectionArgs;
    static toEncodable(fields: CreateCollectionArgsFields): {
        name: string;
        symbol: string;
        forMinter: boolean;
        royalty50bps: Buffer;
    };
    toJSON(): CreateCollectionArgsJSON;
    static fromJSON(obj: CreateCollectionArgsJSON): CreateCollectionArgs;
    toEncodable(): {
        name: string;
        symbol: string;
        forMinter: boolean;
        royalty50bps: Buffer;
    };
}
