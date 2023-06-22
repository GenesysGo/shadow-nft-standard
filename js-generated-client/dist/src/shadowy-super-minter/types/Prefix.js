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
exports.layout = exports.fromJSON = exports.fromDecoded = exports.Other = exports.Arweave = exports.ShadowDrive = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
class ShadowDrive {
    constructor(value) {
        this.discriminator = 0;
        this.kind = "ShadowDrive";
        this.value = {
            account: value.account,
        };
    }
    toJSON() {
        return {
            kind: "ShadowDrive",
            value: {
                account: this.value.account.toString(),
            },
        };
    }
    toEncodable() {
        return {
            ShadowDrive: {
                account: this.value.account,
            },
        };
    }
}
exports.ShadowDrive = ShadowDrive;
ShadowDrive.discriminator = 0;
ShadowDrive.kind = "ShadowDrive";
class Arweave {
    constructor() {
        this.discriminator = 1;
        this.kind = "Arweave";
    }
    toJSON() {
        return {
            kind: "Arweave",
        };
    }
    toEncodable() {
        return {
            Arweave: {},
        };
    }
}
exports.Arweave = Arweave;
Arweave.discriminator = 1;
Arweave.kind = "Arweave";
class Other {
    constructor(value) {
        this.discriminator = 2;
        this.kind = "Other";
        this.value = {
            prefix: value.prefix,
        };
    }
    toJSON() {
        return {
            kind: "Other",
            value: {
                prefix: this.value.prefix,
            },
        };
    }
    toEncodable() {
        return {
            Other: {
                prefix: this.value.prefix,
            },
        };
    }
}
exports.Other = Other;
Other.discriminator = 2;
Other.kind = "Other";
function fromDecoded(obj) {
    if (typeof obj !== "object") {
        throw new Error("Invalid enum object");
    }
    if ("ShadowDrive" in obj) {
        const val = obj["ShadowDrive"];
        return new ShadowDrive({
            account: val["account"],
        });
    }
    if ("Arweave" in obj) {
        return new Arweave();
    }
    if ("Other" in obj) {
        const val = obj["Other"];
        return new Other({
            prefix: val["prefix"],
        });
    }
    throw new Error("Invalid enum object");
}
exports.fromDecoded = fromDecoded;
function fromJSON(obj) {
    switch (obj.kind) {
        case "ShadowDrive": {
            return new ShadowDrive({
                account: new web3_js_1.PublicKey(obj.value.account),
            });
        }
        case "Arweave": {
            return new Arweave();
        }
        case "Other": {
            return new Other({
                prefix: obj.value.prefix,
            });
        }
    }
}
exports.fromJSON = fromJSON;
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([borsh.publicKey("account")], "ShadowDrive"),
        borsh.struct([], "Arweave"),
        borsh.struct([borsh.str("prefix")], "Other"),
    ]);
    if (property !== undefined) {
        return ret.replicate(property);
    }
    return ret;
}
exports.layout = layout;
//# sourceMappingURL=Prefix.js.map