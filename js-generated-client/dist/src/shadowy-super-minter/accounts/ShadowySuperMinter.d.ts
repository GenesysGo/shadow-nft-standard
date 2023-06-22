/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export interface ShadowySuperMinterFields {
    creatorGroup: PublicKey;
    collection: PublicKey;
    itemsRedeemed: number;
    isMutable: boolean;
    itemsAvailable: number;
    price: BN;
    startTime: BN;
    endTime: BN;
}
export interface ShadowySuperMinterJSON {
    creatorGroup: string;
    collection: string;
    itemsRedeemed: number;
    isMutable: boolean;
    itemsAvailable: number;
    price: string;
    startTime: string;
    endTime: string;
}
export declare class ShadowySuperMinter {
    readonly creatorGroup: PublicKey;
    readonly collection: PublicKey;
    readonly itemsRedeemed: number;
    readonly isMutable: boolean;
    readonly itemsAvailable: number;
    readonly price: BN;
    readonly startTime: BN;
    readonly endTime: BN;
    static readonly discriminator: Buffer;
    static readonly layout: any;
    constructor(fields: ShadowySuperMinterFields);
    static fetch(c: Connection, address: PublicKey, programId?: PublicKey): Promise<ShadowySuperMinter | null>;
    static fetchMultiple(c: Connection, addresses: PublicKey[], programId?: PublicKey): Promise<Array<ShadowySuperMinter | null>>;
    static decode(data: Buffer): ShadowySuperMinter;
    toJSON(): ShadowySuperMinterJSON;
    static fromJSON(obj: ShadowySuperMinterJSON): ShadowySuperMinter;
}
