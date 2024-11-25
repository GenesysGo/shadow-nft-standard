import * as borsh from "@coral-xyz/borsh";

import * as types from "../types";

export interface PngJSON {
  kind: "Png";
}

export class Png {
  static readonly discriminator = 0;
  static readonly kind = "Png";
  readonly discriminator = 0;
  readonly kind = "Png";

  toJSON(): PngJSON {
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

export interface JpegJSON {
  kind: "Jpeg";
}

export class Jpeg {
  static readonly discriminator = 1;
  static readonly kind = "Jpeg";
  readonly discriminator = 1;
  readonly kind = "Jpeg";

  toJSON(): JpegJSON {
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

export interface GifJSON {
  kind: "Gif";
}

export class Gif {
  static readonly discriminator = 2;
  static readonly kind = "Gif";
  readonly discriminator = 2;
  readonly kind = "Gif";

  toJSON(): GifJSON {
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

export interface Mp3JSON {
  kind: "Mp3";
}

export class Mp3 {
  static readonly discriminator = 3;
  static readonly kind = "Mp3";
  readonly discriminator = 3;
  readonly kind = "Mp3";

  toJSON(): Mp3JSON {
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

export interface Mp4JSON {
  kind: "Mp4";
}

export class Mp4 {
  static readonly discriminator = 4;
  static readonly kind = "Mp4";
  readonly discriminator = 4;
  readonly kind = "Mp4";

  toJSON(): Mp4JSON {
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

export type OtherFields = {
  other: string;
};
export type OtherValue = {
  other: string;
};

export interface OtherJSON {
  kind: "Other";
  value: {
    other: string;
  };
}

export class Other {
  static readonly discriminator = 5;
  static readonly kind = "Other";
  readonly discriminator = 5;
  readonly kind = "Other";
  readonly value: OtherValue;

  constructor(value: OtherFields) {
    this.value = {
      other: value.other,
    };
  }

  toJSON(): OtherJSON {
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

// eslint-disable-next-line
export function fromDecoded(obj: any): types.AssetTypeKind {
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

export function fromJSON(obj: types.AssetTypeJSON): types.AssetTypeKind {
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

export function layout(property?: string) {
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
