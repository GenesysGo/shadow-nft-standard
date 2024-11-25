import * as borsh from "@coral-xyz/borsh";

import * as types from "../types";

export interface InvalidAsciiJSON {
  kind: "InvalidAscii";
}

export class InvalidAscii {
  static readonly discriminator = 0;
  static readonly kind = "InvalidAscii";
  readonly discriminator = 0;
  readonly kind = "InvalidAscii";

  toJSON(): InvalidAsciiJSON {
    return {
      kind: "InvalidAscii",
    };
  }

  toEncodable() {
    return {
      InvalidAscii: {},
    };
  }
}

export interface IncorrectCaseOrInvalidCharactersJSON {
  kind: "IncorrectCaseOrInvalidCharacters";
}

export class IncorrectCaseOrInvalidCharacters {
  static readonly discriminator = 1;
  static readonly kind = "IncorrectCaseOrInvalidCharacters";
  readonly discriminator = 1;
  readonly kind = "IncorrectCaseOrInvalidCharacters";

  toJSON(): IncorrectCaseOrInvalidCharactersJSON {
    return {
      kind: "IncorrectCaseOrInvalidCharacters",
    };
  }

  toEncodable() {
    return {
      IncorrectCaseOrInvalidCharacters: {},
    };
  }
}

export interface ExceedsMaxLengthJSON {
  kind: "ExceedsMaxLength";
}

export class ExceedsMaxLength {
  static readonly discriminator = 2;
  static readonly kind = "ExceedsMaxLength";
  readonly discriminator = 2;
  readonly kind = "ExceedsMaxLength";

  toJSON(): ExceedsMaxLengthJSON {
    return {
      kind: "ExceedsMaxLength",
    };
  }

  toEncodable() {
    return {
      ExceedsMaxLength: {},
    };
  }
}

// eslint-disable-next-line
export function fromDecoded(obj: any): types.SymbolErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("InvalidAscii" in obj) {
    return new InvalidAscii();
  }
  if ("IncorrectCaseOrInvalidCharacters" in obj) {
    return new IncorrectCaseOrInvalidCharacters();
  }
  if ("ExceedsMaxLength" in obj) {
    return new ExceedsMaxLength();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(obj: types.SymbolErrorJSON): types.SymbolErrorKind {
  switch (obj.kind) {
    case "InvalidAscii": {
      return new InvalidAscii();
    }
    case "IncorrectCaseOrInvalidCharacters": {
      return new IncorrectCaseOrInvalidCharacters();
    }
    case "ExceedsMaxLength": {
      return new ExceedsMaxLength();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "InvalidAscii"),
    borsh.struct([], "IncorrectCaseOrInvalidCharacters"),
    borsh.struct([], "ExceedsMaxLength"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
