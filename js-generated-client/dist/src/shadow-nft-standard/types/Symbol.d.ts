export interface SymbolFields {
    inner: Array<number>;
}
export interface SymbolJSON {
    inner: Array<number>;
}
export declare class Symbol {
    readonly inner: Array<number>;
    constructor(fields: SymbolFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): Symbol;
    static toEncodable(fields: SymbolFields): {
        inner: number[];
    };
    toJSON(): SymbolJSON;
    static fromJSON(obj: SymbolJSON): Symbol;
    toEncodable(): {
        inner: number[];
    };
}
