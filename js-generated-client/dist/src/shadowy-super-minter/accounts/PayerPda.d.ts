/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
export interface PayerPdaFields {
}
export interface PayerPdaJSON {
}
export declare class PayerPda {
    static readonly discriminator: Buffer;
    static readonly layout: any;
    constructor(fields: PayerPdaFields);
    static fetch(c: Connection, address: PublicKey, programId?: PublicKey): Promise<PayerPda | null>;
    static fetchMultiple(c: Connection, addresses: PublicKey[], programId?: PublicKey): Promise<Array<PayerPda | null>>;
    static decode(data: Buffer): PayerPda;
    toJSON(): PayerPdaJSON;
    static fromJSON(obj: PayerPdaJSON): PayerPda;
}
