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
exports.Prefix = exports.SymbolError = exports.UpdateMetaArgs = exports.CreateMetaArgs = exports.CreateGroupArgs = exports.CreateCollectionArgs = exports.Url = exports.Symbol = void 0;
const SymbolError = __importStar(require("./SymbolError"));
exports.SymbolError = SymbolError;
const Prefix = __importStar(require("./Prefix"));
exports.Prefix = Prefix;
var Symbol_1 = require("./Symbol");
Object.defineProperty(exports, "Symbol", { enumerable: true, get: function () { return Symbol_1.Symbol; } });
var Url_1 = require("./Url");
Object.defineProperty(exports, "Url", { enumerable: true, get: function () { return Url_1.Url; } });
var CreateCollectionArgs_1 = require("./CreateCollectionArgs");
Object.defineProperty(exports, "CreateCollectionArgs", { enumerable: true, get: function () { return CreateCollectionArgs_1.CreateCollectionArgs; } });
var CreateGroupArgs_1 = require("./CreateGroupArgs");
Object.defineProperty(exports, "CreateGroupArgs", { enumerable: true, get: function () { return CreateGroupArgs_1.CreateGroupArgs; } });
var CreateMetaArgs_1 = require("./CreateMetaArgs");
Object.defineProperty(exports, "CreateMetaArgs", { enumerable: true, get: function () { return CreateMetaArgs_1.CreateMetaArgs; } });
var UpdateMetaArgs_1 = require("./UpdateMetaArgs");
Object.defineProperty(exports, "UpdateMetaArgs", { enumerable: true, get: function () { return UpdateMetaArgs_1.UpdateMetaArgs; } });
//# sourceMappingURL=index.js.map