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
exports.Metadata = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const programId_1 = require("../programId");
const types = __importStar(require("../types"));
class Metadata {
    constructor(fields) {
        this.mint = fields.mint;
        this.updateAuthority = fields.updateAuthority;
        this.collectionKey = fields.collectionKey;
        this.postPrimary = fields.postPrimary;
        this.mutable = fields.mutable;
        this.name = fields.name;
        this.uri = new types.Url({ ...fields.uri });
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
        if (!data.slice(0, 8).equals(Metadata.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        const dec = Metadata.layout.decode(data.slice(8));
        return new Metadata({
            mint: dec.mint,
            updateAuthority: dec.updateAuthority,
            collectionKey: dec.collectionKey,
            postPrimary: dec.postPrimary,
            mutable: dec.mutable,
            name: dec.name,
            uri: types.Url.fromDecoded(dec.uri),
        });
    }
    toJSON() {
        return {
            mint: this.mint.toString(),
            updateAuthority: this.updateAuthority.toString(),
            collectionKey: this.collectionKey.toString(),
            postPrimary: this.postPrimary,
            mutable: this.mutable,
            name: this.name,
            uri: this.uri.toJSON(),
        };
    }
    static fromJSON(obj) {
        return new Metadata({
            mint: new web3_js_1.PublicKey(obj.mint),
            updateAuthority: new web3_js_1.PublicKey(obj.updateAuthority),
            collectionKey: new web3_js_1.PublicKey(obj.collectionKey),
            postPrimary: obj.postPrimary,
            mutable: obj.mutable,
            name: obj.name,
            uri: types.Url.fromJSON(obj.uri),
        });
    }
}
exports.Metadata = Metadata;
Metadata.discriminator = Buffer.from([
    72, 11, 121, 26, 111, 181, 85, 93,
]);
Metadata.layout = borsh.struct([
    borsh.publicKey("mint"),
    borsh.publicKey("updateAuthority"),
    borsh.publicKey("collectionKey"),
    borsh.bool("postPrimary"),
    borsh.bool("mutable"),
    borsh.str("name"),
    types.Url.layout("uri"),
]);
//# sourceMappingURL=Metadata.js.map