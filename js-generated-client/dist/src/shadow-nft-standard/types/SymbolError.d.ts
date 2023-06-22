import * as borsh from "@coral-xyz/borsh";
import * as types from "../types";
export interface InvalidAsciiJSON {
    kind: "InvalidAscii";
}
export declare class InvalidAscii {
    static readonly discriminator = 0;
    static readonly kind = "InvalidAscii";
    readonly discriminator = 0;
    readonly kind = "InvalidAscii";
    toJSON(): InvalidAsciiJSON;
    toEncodable(): {
        InvalidAscii: {};
    };
}
export interface IncorrectCaseOrInvalidCharactersJSON {
    kind: "IncorrectCaseOrInvalidCharacters";
}
export declare class IncorrectCaseOrInvalidCharacters {
    static readonly discriminator = 1;
    static readonly kind = "IncorrectCaseOrInvalidCharacters";
    readonly discriminator = 1;
    readonly kind = "IncorrectCaseOrInvalidCharacters";
    toJSON(): IncorrectCaseOrInvalidCharactersJSON;
    toEncodable(): {
        IncorrectCaseOrInvalidCharacters: {};
    };
}
export interface ExceedsMaxLengthJSON {
    kind: "ExceedsMaxLength";
}
export declare class ExceedsMaxLength {
    static readonly discriminator = 2;
    static readonly kind = "ExceedsMaxLength";
    readonly discriminator = 2;
    readonly kind = "ExceedsMaxLength";
    toJSON(): ExceedsMaxLengthJSON;
    toEncodable(): {
        ExceedsMaxLength: {};
    };
}
export declare function fromDecoded(obj: any): types.SymbolErrorKind;
export declare function fromJSON(obj: types.SymbolErrorJSON): types.SymbolErrorKind;
export declare function layout(property?: string): borsh.EnumLayout<unknown>;
