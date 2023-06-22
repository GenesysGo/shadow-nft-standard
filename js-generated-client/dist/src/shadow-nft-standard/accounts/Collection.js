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
exports.Collection = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const programId_1 = require("../programId");
const types = __importStar(require("../types"));
class Collection {
    constructor(fields) {
        this.creatorGroupKey = fields.creatorGroupKey;
        this.size = fields.size;
        this.sigs = fields.sigs;
        this.forMinter = fields.forMinter;
        this.royalty50bps = fields.royalty50bps;
        this.symbol = new types.Symbol({ ...fields.symbol });
        this.name = fields.name;
    }
    static async fetch(c, address, programId = programId_1.PROGRAM_ID) {
        const info = await c.getAccountInfo(address);
        if (info === null) {
            return null;
        }
        if (!info.owner.equals(programId)) {
            throw new Error("account doesn't belong to this program");
        }
        return this.decode(info.data);
    }
    static async fetchMultiple(c, addresses, programId = programId_1.PROGRAM_ID) {
        const infos = await c.getMultipleAccountsInfo(addresses);
        return infos.map((info) => {
            if (info === null) {
                return null;
            }
            if (!info.owner.equals(programId)) {
                throw new Error("account doesn't belong to this program");
            }
            return this.decode(info.data);
        });
    }
    static decode(data) {
        if (!data.slice(0, 8).equals(Collection.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        const dec = Collection.layout.decode(data.slice(8));
        return new Collection({
            creatorGroupKey: dec.creatorGroupKey,
            size: dec.size,
            sigs: dec.sigs,
            forMinter: dec.forMinter,
            royalty50bps: dec.royalty50bps,
            symbol: types.Symbol.fromDecoded(dec.symbol),
            name: dec.name,
        });
    }
    toJSON() {
        return {
            creatorGroupKey: this.creatorGroupKey.toString(),
            size: this.size,
            sigs: this.sigs,
            forMinter: this.forMinter,
            royalty50bps: this.royalty50bps,
            symbol: this.symbol.toJSON(),
            name: this.name,
        };
    }
    static fromJSON(obj) {
        return new Collection({
            creatorGroupKey: new web3_js_1.PublicKey(obj.creatorGroupKey),
            size: obj.size,
            sigs: obj.sigs,
            forMinter: obj.forMinter,
            royalty50bps: obj.royalty50bps,
            symbol: types.Symbol.fromJSON(obj.symbol),
            name: obj.name,
        });
    }
}
exports.Collection = Collection;
Collection.discriminator = Buffer.from([
    48, 160, 232, 205, 191, 207, 26, 141,
]);
Collection.layout = borsh.struct([
    borsh.publicKey("creatorGroupKey"),
    borsh.u32("size"),
    borsh.u8("sigs"),
    borsh.bool("forMinter"),
    borsh.array(borsh.u8(), 8, "royalty50bps"),
    types.Symbol.layout("symbol"),
    borsh.str("name"),
]);
//# sourceMappingURL=Collection.js.map