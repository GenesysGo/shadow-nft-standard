import * as borsh from "@coral-xyz/borsh";

import * as types from "../types";

export interface UniformMintFields {
  revealHash: Array<number>;
  namePrefix: string;
  prefixUri: types.PrefixKind;
}

export interface UniformMintJSON {
  revealHash: Array<number>;
  namePrefix: string;
  prefixUri: types.PrefixJSON;
}

export class UniformMint {
  readonly revealHash: Array<number>;
  readonly namePrefix: string;
  readonly prefixUri: types.PrefixKind;

  constructor(fields: UniformMintFields) {
    this.revealHash = fields.revealHash;
    this.namePrefix = fields.namePrefix;
    this.prefixUri = fields.prefixUri;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, "revealHash"),
        borsh.str("namePrefix"),
        types.Prefix.layout("prefixUri"),
      ],
      property
    );
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new UniformMint({
      revealHash: obj.revealHash,
      namePrefix: obj.namePrefix,
      prefixUri: types.Prefix.fromDecoded(obj.prefixUri),
    });
  }

  static toEncodable(fields: UniformMintFields) {
    return {
      revealHash: fields.revealHash,
      namePrefix: fields.namePrefix,
      prefixUri: fields.prefixUri.toEncodable(),
    };
  }

  toJSON(): UniformMintJSON {
    return {
      revealHash: this.revealHash,
      namePrefix: this.namePrefix,
      prefixUri: this.prefixUri.toJSON(),
    };
  }

  static fromJSON(obj: UniformMintJSON): UniformMint {
    return new UniformMint({
      revealHash: obj.revealHash,
      namePrefix: obj.namePrefix,
      prefixUri: types.Prefix.fromJSON(obj.prefixUri),
    });
  }

  toEncodable() {
    return UniformMint.toEncodable(this);
  }
}
