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
exports.CreateCollectionArgs = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
class CreateCollectionArgs {
    constructor(fields) {
        this.name = fields.name;
        this.symbol = fields.symbol;
        this.forMinter = fields.forMinter;
        this.royalty50bps = fields.royalty50bps;
    }
    static layout(property) {
        return borsh.struct([
            borsh.str("name"),
            borsh.str("symbol"),
            borsh.bool("forMinter"),
            borsh.vecU8("royalty50bps"),
        ], property);
    }
    static fromDecoded(obj) {
        return new CreateCollectionArgs({
            name: obj.name,
            symbol: obj.symbol,
            forMinter: obj.forMinter,
            royalty50bps: new Uint8Array(obj.royalty50bps.buffer, obj.royalty50bps.byteOffset, obj.royalty50bps.length),
        });
    }
    static toEncodable(fields) {
        return {
            name: fields.name,
            symbol: fields.symbol,
            forMinter: fields.forMinter,
            royalty50bps: Buffer.from(fields.royalty50bps.buffer, fields.royalty50bps.byteOffset, fields.royalty50bps.length),
        };
    }
    toJSON() {
        return {
            name: this.name,
            symbol: this.symbol,
            forMinter: this.forMinter,
            royalty50bps: Array.from(this.royalty50bps.values()),
        };
    }
    static fromJSON(obj) {
        return new CreateCollectionArgs({
            name: obj.name,
            symbol: obj.symbol,
            forMinter: obj.forMinter,
            royalty50bps: Uint8Array.from(obj.royalty50bps),
        });
    }
    toEncodable() {
        return CreateCollectionArgs.toEncodable(this);
    }
}
exports.CreateCollectionArgs = CreateCollectionArgs;
//# sourceMappingURL=CreateCollectionArgs.js.map