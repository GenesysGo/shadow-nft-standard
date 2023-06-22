import { PublicKey } from "@solana/web3.js";
import * as anchor from "./anchor";
import * as custom from "./custom";
export declare function fromCode(code: number, logs?: string[]): custom.CustomError | anchor.AnchorError | null;
export declare function fromTxError(err: unknown, programId?: PublicKey): custom.CustomError | anchor.AnchorError | null;
