import * as borsh from "@coral-xyz/borsh";

import * as types from "../types";

export interface AssetFields {
  name: string;
  uri: types.UrlFields;
}

export interface AssetJSON {
  name: string;
  uri: types.UrlJSON;
}

export class Asset {
  readonly name: string;
  readonly uri: types.Url;

  constructor(fields: AssetFields) {
    this.name = fields.name;
    this.uri = new types.Url({ ...fields.uri });
  }

  static layout(property?: string) {
    return borsh.struct([borsh.str("name"), types.Url.layout("uri")], property);
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new Asset({
      name: obj.name,
      uri: types.Url.fromDecoded(obj.uri),
    });
  }

  static toEncodable(fields: AssetFields) {
    return {
      name: fields.name,
      uri: types.Url.toEncodable(fields.uri),
    };
  }

  toJSON(): AssetJSON {
    return {
      name: this.name,
      uri: this.uri.toJSON(),
    };
  }

  static fromJSON(obj: AssetJSON): Asset {
    return new Asset({
      name: obj.name,
      uri: types.Url.fromJSON(obj.uri),
    });
  }

  toEncodable() {
    return Asset.toEncodable(this);
  }
}
