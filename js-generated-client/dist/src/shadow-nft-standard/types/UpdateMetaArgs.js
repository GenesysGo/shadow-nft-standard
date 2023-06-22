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
exports.UpdateMetaArgs = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
class UpdateMetaArgs {
    constructor(fields) {
        this.name = fields.name;
        this.uri = fields.uri;
        this.mutable = fields.mutable;
    }
    static layout(property) {
        return borsh.struct([
            borsh.option(borsh.str(), "name"),
            borsh.option(borsh.str(), "uri"),
            borsh.option(borsh.bool(), "mutable"),
        ], property);
    }
    static fromDecoded(obj) {
        return new UpdateMetaArgs({
            name: obj.name,
            uri: obj.uri,
            mutable: obj.mutable,
        });
    }
    static toEncodable(fields) {
        return {
            name: fields.name,
            uri: fields.uri,
            mutable: fields.mutable,
        };
    }
    toJSON() {
        return {
            name: this.name,
            uri: this.uri,
            mutable: this.mutable,
        };
    }
    static fromJSON(obj) {
        return new UpdateMetaArgs({
            name: obj.name,
            uri: obj.uri,
            mutable: obj.mutable,
        });
    }
    toEncodable() {
        return UpdateMetaArgs.toEncodable(this);
    }
}
exports.UpdateMetaArgs = UpdateMetaArgs;
//# sourceMappingURL=UpdateMetaArgs.js.map