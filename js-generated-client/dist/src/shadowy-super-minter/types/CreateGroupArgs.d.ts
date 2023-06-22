export interface CreateGroupArgsFields {
    name: string;
}
export interface CreateGroupArgsJSON {
    name: string;
}
export declare class CreateGroupArgs {
    readonly name: string;
    constructor(fields: CreateGroupArgsFields);
    static layout(property?: string): any;
    static fromDecoded(obj: any): CreateGroupArgs;
    static toEncodable(fields: CreateGroupArgsFields): {
        name: string;
    };
    toJSON(): CreateGroupArgsJSON;
    static fromJSON(obj: CreateGroupArgsJSON): CreateGroupArgs;
    toEncodable(): {
        name: string;
    };
}
