/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export interface CreatorGroupFields {
    sigs: number;
    numCollections: BN;
    creators: Array<PublicKey>;
    name: string;
}
export interface CreatorGroupJSON {
    sigs: number;
    numCollections: string;
    creators: Array<string>;
    name: string;
}
export declare class CreatorGroup {
    readonly sigs: number;
    readonly numCollections: BN;
    readonly creators: Array<PublicKey>;
    readonly name: string;
    static readonly discriminator: Buffer;
    static readonly layout: any;
    constructor(fields: CreatorGroupFields);
    static fetch(c: Connection, address: PublicKey, programId?: PublicKey): Promise<CreatorGroup | null>;
    static fetchMultiple(c: Connection, addresses: PublicKey[], programId?: PublicKey): Promise<Array<CreatorGroup | null>>;
    static decode(data: Buffer): CreatorGroup;
    toJSON(): CreatorGroupJSON;
    static fromJSON(obj: CreatorGroupJSON): CreatorGroup;
}
