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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorGroup = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const programId_1 = require("../programId");
class CreatorGroup {
    constructor(fields) {
        this.sigs = fields.sigs;
        this.numCollections = fields.numCollections;
        this.creators = fields.creators;
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
        if (!data.slice(0, 8).equals(CreatorGroup.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        const dec = CreatorGroup.layout.decode(data.slice(8));
        return new CreatorGroup({
            sigs: dec.sigs,
            numCollections: dec.numCollections,
            creators: dec.creators,
            name: dec.name,
        });
    }
    toJSON() {
        return {
            sigs: this.sigs,
            numCollections: this.numCollections.toString(),
            creators: this.creators.map((item) => item.toString()),
            name: this.name,
        };
    }
    static fromJSON(obj) {
        return new CreatorGroup({
            sigs: obj.sigs,
            numCollections: new bn_js_1.default(obj.numCollections),
            creators: obj.creators.map((item) => new web3_js_1.PublicKey(item)),
            name: obj.name,
        });
    }
}
exports.CreatorGroup = CreatorGroup;
CreatorGroup.discriminator = Buffer.from([
    65, 127, 63, 76, 244, 96, 171, 134,
]);
CreatorGroup.layout = borsh.struct([
    borsh.u8("sigs"),
    borsh.u64("numCollections"),
    borsh.vec(borsh.publicKey(), "creators"),
    borsh.str("name"),
]);
//# sourceMappingURL=CreatorGroup.js.map