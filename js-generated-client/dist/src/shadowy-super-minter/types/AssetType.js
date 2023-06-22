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
exports.layout = exports.fromJSON = exports.fromDecoded = exports.Other = exports.Mp4 = exports.Mp3 = exports.Gif = exports.Jpeg = exports.Png = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
class Png {
    constructor() {
        this.discriminator = 0;
        this.kind = "Png";
    }
    toJSON() {
        return {
            kind: "Png",
        };
    }
    toEncodable() {
        return {
            Png: {},
        };
    }
}
exports.Png = Png;
Png.discriminator = 0;
Png.kind = "Png";
class Jpeg {
    constructor() {
        this.discriminator = 1;
        this.kind = "Jpeg";
    }
    toJSON() {
        return {
            kind: "Jpeg",
        };
    }
    toEncodable() {
        return {
            Jpeg: {},
        };
    }
}
exports.Jpeg = Jpeg;
Jpeg.discriminator = 1;
Jpeg.kind = "Jpeg";
class Gif {
    constructor() {
        this.discriminator = 2;
        this.kind = "Gif";
    }
    toJSON() {
        return {
            kind: "Gif",
        };
    }
    toEncodable() {
        return {
            Gif: {},
        };
    }
}
exports.Gif = Gif;
Gif.discriminator = 2;
Gif.kind = "Gif";
class Mp3 {
    constructor() {
        this.discriminator = 3;
        this.kind = "Mp3";
    }
    toJSON() {
        return {
            kind: "Mp3",
        };
    }
    toEncodable() {
        return {
            Mp3: {},
        };
    }
}
exports.Mp3 = Mp3;
Mp3.discriminator = 3;
Mp3.kind = "Mp3";
class Mp4 {
    constructor() {
        this.discriminator = 4;
        this.kind = "Mp4";
    }
    toJSON() {
        return {
            kind: "Mp4",
        };
    }
    toEncodable() {
        return {
            Mp4: {},
        };
    }
}
exports.Mp4 = Mp4;
Mp4.discriminator = 4;
Mp4.kind = "Mp4";
class Other {
    constructor(value) {
        this.discriminator = 5;
        this.kind = "Other";
        this.value = {
            other: value.other,
        };
    }
    toJSON() {
        return {
            kind: "Other",
            value: {
                other: this.value.other,
            },
        };
    }
    toEncodable() {
        return {
            Other: {
                other: this.value.other,
            },
        };
    }
}
exports.Other = Other;
Other.discriminator = 5;
Other.kind = "Other";
function fromDecoded(obj) {
    if (typeof obj !== "object") {
        throw new Error("Invalid enum object");
    }
    if ("Png" in obj) {
        return new Png();
    }
    if ("Jpeg" in obj) {
        return new Jpeg();
    }
    if ("Gif" in obj) {
        return new Gif();
    }
    if ("Mp3" in obj) {
        return new Mp3();
    }
    if ("Mp4" in obj) {
        return new Mp4();
    }
    if ("Other" in obj) {
        const val = obj["Other"];
        return new Other({
            other: val["other"],
        });
    }
    throw new Error("Invalid enum object");
}
exports.fromDecoded = fromDecoded;
function fromJSON(obj) {
    switch (obj.kind) {
        case "Png": {
            return new Png();
        }
        case "Jpeg": {
            return new Jpeg();
        }
        case "Gif": {
            return new Gif();
        }
        case "Mp3": {
            return new Mp3();
        }
        case "Mp4": {
            return new Mp4();
        }
        case "Other": {
            return new Other({
                other: obj.value.other,
            });
        }
    }
}
exports.fromJSON = fromJSON;
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([], "Png"),
        borsh.struct([], "Jpeg"),
        borsh.struct([], "Gif"),
        borsh.struct([], "Mp3"),
        borsh.struct([], "Mp4"),
        borsh.struct([borsh.str("other")], "Other"),
    ]);
    if (property !== undefined) {
        return ret.replicate(property);
    }
    return ret;
}
exports.layout = layout;
//# sourceMappingURL=AssetType.js.map