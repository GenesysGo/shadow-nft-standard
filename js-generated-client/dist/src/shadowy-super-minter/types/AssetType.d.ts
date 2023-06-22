import * as borsh from "@coral-xyz/borsh";
import * as types from "../types";
export interface PngJSON {
    kind: "Png";
}
export declare class Png {
    static readonly discriminator = 0;
    static readonly kind = "Png";
    readonly discriminator = 0;
    readonly kind = "Png";
    toJSON(): PngJSON;
    toEncodable(): {
        Png: {};
    };
}
export interface JpegJSON {
    kind: "Jpeg";
}
export declare class Jpeg {
    static readonly discriminator = 1;
    static readonly kind = "Jpeg";
    readonly discriminator = 1;
    readonly kind = "Jpeg";
    toJSON(): JpegJSON;
    toEncodable(): {
        Jpeg: {};
    };
}
export interface GifJSON {
    kind: "Gif";
}
export declare class Gif {
    static readonly discriminator = 2;
    static readonly kind = "Gif";
    readonly discriminator = 2;
    readonly kind = "Gif";
    toJSON(): GifJSON;
    toEncodable(): {
        Gif: {};
    };
}
export interface Mp3JSON {
    kind: "Mp3";
}
export declare class Mp3 {
    static readonly discriminator = 3;
    static readonly kind = "Mp3";
    readonly discriminator = 3;
    readonly kind = "Mp3";
    toJSON(): Mp3JSON;
    toEncodable(): {
        Mp3: {};
    };
}
export interface Mp4JSON {
    kind: "Mp4";
}
export declare class Mp4 {
    static readonly discriminator = 4;
    static readonly kind = "Mp4";
    readonly discriminator = 4;
    readonly kind = "Mp4";
    toJSON(): Mp4JSON;
    toEncodable(): {
        Mp4: {};
    };
}
export type OtherFields = {
    other: string;
};
export type OtherValue = {
    other: string;
};
export interface OtherJSON {
    kind: "Other";
    value: {
        other: string;
    };
}
export declare class Other {
    static readonly discriminator = 5;
    static readonly kind = "Other";
    readonly discriminator = 5;
    readonly kind = "Other";
    readonly value: OtherValue;
    constructor(value: OtherFields);
    toJSON(): OtherJSON;
    toEncodable(): {
        Other: {
            other: string;
        };
    };
}
export declare function fromDecoded(obj: any): types.AssetTypeKind;
export declare function fromJSON(obj: types.AssetTypeJSON): types.AssetTypeKind;
export declare function layout(property?: string): borsh.EnumLayout<unknown>;
