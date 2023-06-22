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
exports.InitializeArgs = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const bn_js_1 = __importDefault(require("bn.js"));
const types = __importStar(require("../types"));
class InitializeArgs {
    constructor(fields) {
        this.itemsAvailable = fields.itemsAvailable;
        this.price = fields.price;
        this.startTime = fields.startTime;
        this.endTime = fields.endTime;
        this.mintType = new types.UniformMint({ ...fields.mintType });
        this.ifInitCollection =
            (fields.ifInitCollection &&
                new types.CreateCollectionArgs({ ...fields.ifInitCollection })) ||
                null;
        this.ifInitGroupName = fields.ifInitGroupName;
    }
    static layout(property) {
        return borsh.struct([
            borsh.u32("itemsAvailable"),
            borsh.u64("price"),
            borsh.i64("startTime"),
            borsh.i64("endTime"),
            types.UniformMint.layout("mintType"),
            borsh.option(types.CreateCollectionArgs.layout(), "ifInitCollection"),
            borsh.str("ifInitGroupName"),
        ], property);
    }
    static fromDecoded(obj) {
        return new InitializeArgs({
            itemsAvailable: obj.itemsAvailable,
            price: obj.price,
            startTime: obj.startTime,
            endTime: obj.endTime,
            mintType: types.UniformMint.fromDecoded(obj.mintType),
            ifInitCollection: (obj.ifInitCollection &&
                types.CreateCollectionArgs.fromDecoded(obj.ifInitCollection)) ||
                null,
            ifInitGroupName: obj.ifInitGroupName,
        });
    }
    static toEncodable(fields) {
        return {
            itemsAvailable: fields.itemsAvailable,
            price: fields.price,
            startTime: fields.startTime,
            endTime: fields.endTime,
            mintType: types.UniformMint.toEncodable(fields.mintType),
            ifInitCollection: (fields.ifInitCollection &&
                types.CreateCollectionArgs.toEncodable(fields.ifInitCollection)) ||
                null,
            ifInitGroupName: fields.ifInitGroupName,
        };
    }
    toJSON() {
        return {
            itemsAvailable: this.itemsAvailable,
            price: this.price.toString(),
            startTime: this.startTime.toString(),
            endTime: this.endTime.toString(),
            mintType: this.mintType.toJSON(),
            ifInitCollection: (this.ifInitCollection && this.ifInitCollection.toJSON()) || null,
            ifInitGroupName: this.ifInitGroupName,
        };
    }
    static fromJSON(obj) {
        return new InitializeArgs({
            itemsAvailable: obj.itemsAvailable,
            price: new bn_js_1.default(obj.price),
            startTime: new bn_js_1.default(obj.startTime),
            endTime: new bn_js_1.default(obj.endTime),
            mintType: types.UniformMint.fromJSON(obj.mintType),
            ifInitCollection: (obj.ifInitCollection &&
                types.CreateCollectionArgs.fromJSON(obj.ifInitCollection)) ||
                null,
            ifInitGroupName: obj.ifInitGroupName,
        });
    }
    toEncodable() {
        return InitializeArgs.toEncodable(this);
    }
}
exports.InitializeArgs = InitializeArgs;
//# sourceMappingURL=InitializeArgs.js.map