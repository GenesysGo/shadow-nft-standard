"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.layout = exports.fromJSON = exports.fromDecoded = exports.ExceedsMaxLength = exports.IncorrectCaseOrInvalidCharacters = exports.InvalidAscii = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
class InvalidAscii {
    constructor() {
        this.discriminator = 0;
        this.kind = "InvalidAscii";
    }
    toJSON() {
        return {
            kind: "InvalidAscii",
        };
    }
    toEncodable() {
        return {
            InvalidAscii: {},
        };
    }
}
exports.InvalidAscii = InvalidAscii;
InvalidAscii.discriminator = 0;
InvalidAscii.kind = "InvalidAscii";
class IncorrectCaseOrInvalidCharacters {
    constructor() {
        this.discriminator = 1;
        this.kind = "IncorrectCaseOrInvalidCharacters";
    }
    toJSON() {
        return {
            kind: "IncorrectCaseOrInvalidCharacters",
        };
    }
    toEncodable() {
        return {
            IncorrectCaseOrInvalidCharacters: {},
        };
    }
}
exports.IncorrectCaseOrInvalidCharacters = IncorrectCaseOrInvalidCharacters;
IncorrectCaseOrInvalidCharacters.discriminator = 1;
IncorrectCaseOrInvalidCharacters.kind = "IncorrectCaseOrInvalidCharacters";
class ExceedsMaxLength {
    constructor() {
        this.discriminator = 2;
        this.kind = "ExceedsMaxLength";
    }
    toJSON() {
        return {
            kind: "ExceedsMaxLength",
        };
    }
    toEncodable() {
        return {
            ExceedsMaxLength: {},
        };
    }
}
exports.ExceedsMaxLength = ExceedsMaxLength;
ExceedsMaxLength.discriminator = 2;
ExceedsMaxLength.kind = "ExceedsMaxLength";
function fromDecoded(obj) {
    if (typeof obj !== "object") {
        throw new Error("Invalid enum object");
    }
    if ("InvalidAscii" in obj) {
        return new InvalidAscii();
    }
    if ("IncorrectCaseOrInvalidCharacters" in obj) {
        return new IncorrectCaseOrInvalidCharacters();
    }
    if ("ExceedsMaxLength" in obj) {
        return new ExceedsMaxLength();
    }
    throw new Error("Invalid enum object");
}
exports.fromDecoded = fromDecoded;
function fromJSON(obj) {
    switch (obj.kind) {
        case "InvalidAscii": {
            return new InvalidAscii();
        }
        case "IncorrectCaseOrInvalidCharacters": {
            return new IncorrectCaseOrInvalidCharacters();
        }
        case "ExceedsMaxLength": {
            return new ExceedsMaxLength();
        }
    }
}
exports.fromJSON = fromJSON;
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([], "InvalidAscii"),
        borsh.struct([], "IncorrectCaseOrInvalidCharacters"),
        borsh.struct([], "ExceedsMaxLength"),
    ]);
    if (property !== undefined) {
        return ret.replicate(property);
    }
    return ret;
}
exports.layout = layout;
//# sourceMappingURL=SymbolError.js.map