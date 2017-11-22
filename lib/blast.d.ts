export declare class blast {
    static stringOutput: Boolean;
    static customBlastLocation: string;
    outputString(bool: Boolean): void;
    blastN(db: any, query: any, op: option, cb: any): void;
    blastP(db: any, query: any, op: option, cb: any): void;
    blastX(db: any, query: any, op: option, cb: any): void;
    tblastN(db: any, query: any, op: option, cb: any): void;
    tblastX(db: any, query: any, op: option, cb: any): void;
    makeDB(type: any, fileIn: any, outPath: any, name: any, cb: any): any;
    blastDbAlias(option: AliasOption, cb: any): void;
}
export declare function lookupCustomBlastLocation(): void;
export declare function postBlast(err: any, stdOut: any, stdError: any, options: option, cb: any): any;
export declare function blaster(type: any, db: any, query: any, op: option, cb: any): any;
export declare function run(toRun: String, cb: any): void;
export declare class option implements IOption {
    type: string;
    outputDirectory: string;
    rawOutput: boolean;
    db: string | boolean;
    outfmt: number;
    remote?: boolean | string;
    out: string;
    inputfileformat: string;
    outputfileformat: string;
    query: string;
}
export interface IOption {
    type?: string | boolean;
    outputDirectory: String;
    rawOutput: boolean;
    db: string | boolean;
    outfmt: number;
    remote?: boolean | string;
    out?: string;
    inputfileformat: string;
    outputfileformat: string;
    query: string;
}
export declare class AliasOption implements IAliasOption {
    dblist: Array<string>;
    dbtype: string;
    out: string;
    title: string;
    directory: string;
}
export interface IAliasOption {
    dblist: Array<string>;
    dbtype: string;
    out: string;
    title: string;
    directory: string;
}
