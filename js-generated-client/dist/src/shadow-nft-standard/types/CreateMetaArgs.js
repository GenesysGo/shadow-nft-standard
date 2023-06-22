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
exports.CreateMetaArgs = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const types = __importStar(require("../types"));
class CreateMetaArgs {
    constructor(fields) {
        this.updateAuthority = fields.updateAuthority;
        this.name = fields.name;
        this.uri = new types.Url({ ...fields.uri });
        this.mutable = fields.mutable;
        this.collectionKey = fields.collectionKey;
    }
    static layout(property) {
        return borsh.struct([
            borsh.publicKey("updateAuthority"),
            borsh.str("name"),
            types.Url.layout("uri"),
            borsh.bool("mutable"),
            borsh.publicKey("collectionKey"),
        ], property);
    }
    static fromDecoded(obj) {
        return new CreateMetaArgs({
            updateAuthority: obj.updateAuthority,
            name: obj.name,
            uri: types.Url.fromDecoded(obj.uri),
            mutable: obj.mutable,
            collectionKey: obj.collectionKey,
        });
    }
    static toEncodable(fields) {
        return {
            updateAuthority: fields.updateAuthority,
            name: fields.name,
            uri: types.Url.toEncodable(fields.uri),
            mutable: fields.mutable,
            collectionKey: fields.collectionKey,
        };
    }
    toJSON() {
        return {
            updateAuthority: this.updateAuthority.toString(),
            name: this.name,
            uri: this.uri.toJSON(),
            mutable: this.mutable,
            collectionKey: this.collectionKey.toString(),
        };
    }
    static fromJSON(obj) {
        return new CreateMetaArgs({
            updateAuthority: new web3_js_1.PublicKey(obj.updateAuthority),
            name: obj.name,
            uri: types.Url.fromJSON(obj.uri),
            mutable: obj.mutable,
            collectionKey: new web3_js_1.PublicKey(obj.collectionKey),
        });
    }
    toEncodable() {
        return CreateMetaArgs.toEncodable(this);
    }
}
exports.CreateMetaArgs = CreateMetaArgs;
//# sourceMappingURL=CreateMetaArgs.js.map