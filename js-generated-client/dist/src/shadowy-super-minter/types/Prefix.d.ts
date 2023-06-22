import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";
import * as types from "../types";
export type ShadowDriveFields = {
    account: PublicKey;
};
export type ShadowDriveValue = {
    account: PublicKey;
};
export interface ShadowDriveJSON {
    kind: "ShadowDrive";
    value: {
        account: string;
    };
}
export declare class ShadowDrive {
    static readonly discriminator = 0;
    static readonly kind = "ShadowDrive";
    readonly discriminator = 0;
    readonly kind = "ShadowDrive";
    readonly value: ShadowDriveValue;
    constructor(value: ShadowDriveFields);
    toJSON(): ShadowDriveJSON;
    toEncodable(): {
        ShadowDrive: {
            account: PublicKey;
        };
    };
}
export interface ArweaveJSON {
    kind: "Arweave";
}
export declare class Arweave {
    static readonly discriminator = 1;
    static readonly kind = "Arweave";
    readonly discriminator = 1;
    readonly kind = "Arweave";
    toJSON(): ArweaveJSON;
    toEncodable(): {
        Arweave: {};
    };
}
export type OtherFields = {
    prefix: string;
};
export type OtherValue = {
    prefix: string;
};
export interface OtherJSON {
    kind: "Other";
    value: {
        prefix: string;
    };
}
export declare class Other {
    static readonly discriminator = 2;
    static readonly kind = "Other";
    readonly discriminator = 2;
    readonly kind = "Other";
    readonly value: OtherValue;
    constructor(value: OtherFields);
    toJSON(): OtherJSON;
    toEncodable(): {
        Other: {
            prefix: string;
        };
    };
}
export declare function fromDecoded(obj: any): types.PrefixKind;
export declare function fromJSON(obj: types.PrefixJSON): types.PrefixKind;
export declare function layout(property?: string): borsh.EnumLayout<unknown>;
