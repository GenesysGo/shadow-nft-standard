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
exports.UniformMint = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const types = __importStar(require("../types"));
class UniformMint {
    constructor(fields) {
        this.revealHash = fields.revealHash;
        this.namePrefix = fields.namePrefix;
        this.prefixUri = fields.prefixUri;
    }
    static layout(property) {
        return borsh.struct([
            borsh.array(borsh.u8(), 32, "revealHash"),
            borsh.str("namePrefix"),
            types.Prefix.layout("prefixUri"),
        ], property);
    }
    static fromDecoded(obj) {
        return new UniformMint({
            revealHash: obj.revealHash,
            namePrefix: obj.namePrefix,
            prefixUri: types.Prefix.fromDecoded(obj.prefixUri),
        });
    }
    static toEncodable(fields) {
        return {
            revealHash: fields.revealHash,
            namePrefix: fields.namePrefix,
            prefixUri: fields.prefixUri.toEncodable(),
        };
    }
    toJSON() {
        return {
            revealHash: this.revealHash,
            namePrefix: this.namePrefix,
            prefixUri: this.prefixUri.toJSON(),
        };
    }
    static fromJSON(obj) {
        return new UniformMint({
            revealHash: obj.revealHash,
            namePrefix: obj.namePrefix,
            prefixUri: types.Prefix.fromJSON(obj.prefixUri),
        });
    }
    toEncodable() {
        return UniformMint.toEncodable(this);
    }
}
exports.UniformMint = UniformMint;
//# sourceMappingURL=UniformMint.js.map