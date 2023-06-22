export interface UpdateMetaArgsFields {
    name: string | null;
    uri: string | null;
    mutable: boolean | null;
}
export interface UpdateMetaArgsJSON {
    name: string | null;
    uri: string | null;
    mutable: boolean | null;
}
export declare class UpdateMetaArgs {
    readonly name: string | null;
    readonly uri: string | null;
    readonly mutable: boolean | null;
    constructor(fields: UpdateMetaArgsFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): UpdateMetaArgs;
    static toEncodable(fields: UpdateMetaArgsFields): {
        name: string | null;
        uri: string | null;
        mutable: boolean | null;
    };
    toJSON(): UpdateMetaArgsJSON;
    static fromJSON(obj: UpdateMetaArgsJSON): UpdateMetaArgs;
    toEncodable(): {
        name: string | null;
        uri: string | null;
        mutable: boolean | null;
    };
}
