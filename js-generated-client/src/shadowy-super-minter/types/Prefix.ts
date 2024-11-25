import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

import * as types from "../types";

export type ShadowDriveFields = {
  account: PublicKey;
};
export type ShadowDriveValue = {
  account: PublicKey;
};

export interface ShadowDriveJSON {
  kind: "ShadowDrive";
  value: {
    account: string;
  };
}

export class ShadowDrive {
  static readonly discriminator = 0;
  static readonly kind = "ShadowDrive";
  readonly discriminator = 0;
  readonly kind = "ShadowDrive";
  readonly value: ShadowDriveValue;

  constructor(value: ShadowDriveFields) {
    this.value = {
      account: value.account,
    };
  }

  toJSON(): ShadowDriveJSON {
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

export interface ArweaveJSON {
  kind: "Arweave";
}

export class Arweave {
  static readonly discriminator = 1;
  static readonly kind = "Arweave";
  readonly discriminator = 1;
  readonly kind = "Arweave";

  toJSON(): ArweaveJSON {
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

export type OtherFields = {
  prefix: string;
};
export type OtherValue = {
  prefix: string;
};

export interface OtherJSON {
  kind: "Other";
  value: {
    prefix: string;
  };
}

export class Other {
  static readonly discriminator = 2;
  static readonly kind = "Other";
  readonly discriminator = 2;
  readonly kind = "Other";
  readonly value: OtherValue;

  constructor(value: OtherFields) {
    this.value = {
      prefix: value.prefix,
    };
  }

  toJSON(): OtherJSON {
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

// eslint-disable-next-line
export function fromDecoded(obj: any): types.PrefixKind {
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

export function fromJSON(obj: types.PrefixJSON): types.PrefixKind {
  switch (obj.kind) {
    case "ShadowDrive": {
      return new ShadowDrive({
        account: new PublicKey(obj.value.account),
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

export function layout(property?: string) {
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
