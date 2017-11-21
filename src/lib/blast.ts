///<reference types="../../node_modules/fastautil/bin/index" />
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');
var uuid = require('uuid');
var parseString = require('xml2js').parsestring;
var fastautil= require('fastautil');

export class blast{
    static stringOutput:Boolean=false;
    static customBlastLocation:string="";


    outputString(bool:Boolean) {
        blast.stringOutput = !!(!bool || bool == true);
    };

    blastN (db, query, op:option,cb) {
        blaster('blastn', db, query,op, cb);
    };

    blastP (db, query,op:option, cb) {
        blaster('blastp', db, query,op, cb);
    };

    blastX (db, query,op:option, cb) {
        blaster('blastx', db, query,op, cb);
    };

    tblastN (db, query,op:option, cb) {
        blaster('tblastn', db, query,op, cb);
    };

    tblastX (db, query,op:option, cb) {
        blaster('tblastx', db, query,op, cb);
    };

    //overiding the  old options default..


    makeDB(type, fileIn, outPath, name, cb) {

        if (!type) {
            return cb(new Error('no dbtype supplied'));
        }
        if (!fileIn) {
            return cb(new Error('no file supplied'));
        }
        if (!outPath) {
            return cb(new Error('no output path supplied'));
        }

        var fileNamePartOne = fileIn.replace(/^.*[\\\/]/, '');// remove directories from path
        var filename = fileNamePartOne.substr(0, fileNamePartOne.lastIndexOf('.')); //remove file extensions

        if (outPath.slice(-1) !== '/') {
            outPath = outPath + '/'; // add / out path is one is not supplied
        }

        var fileOut = outPath + filename;

        var makeCommand = 'makeblastdb -in ' + fileIn + ' -dbtype ' + type + ' -out ' + fileOut + ' -title ' + name;
        run(makeCommand, (err, stdOut, stdErr) => {
            return cb(err, stdOut, stdErr, fileOut);
        });
        cb();
    };

    blastDbAlias(option:AliasOption,cb){

        var op= new AliasOption();
         _.merge(op,option);
        // op.dblist=option.dblist;
    console.log(option.dbtype);
        var makeCommand=' blastdb_aliastool -dblist "'+op.dblist+'" -dbtype '+op.dbtype+' -out '+option.out+' -title '+option.title;

        var fileOut = option.out;
        run(makeCommand, (err, stdOut, stdErr) => {
            return cb(err, stdOut, stdErr, fileOut);
        });



    }

}

export function lookupCustomBlastLocation() {
    var lookDir = path.join(__dirname, '../bin');
    var binStats;
    var binFiles;
    var pathToFirst;
    var innerBin;
    var innerBinStats;

    binStats = fs.lstatSync(lookDir);
    if (binStats.isDirectory()) {
        binFiles = fs.readdirSync(lookDir);
        if (binFiles.length) {
            pathToFirst = path.join(lookDir, binFiles[0]);
            innerBin = path.join(pathToFirst, 'bin');
            innerBinStats = fs.lstatSync(innerBin);
            if (innerBinStats.isDirectory()) {
                blast.customBlastLocation = innerBin;
            }
        }
    }


}

export function postBlast(err, stdOut, stdError, options:option, cb) {
    var outFile = options.out;
    var isRaw = options.rawOutput || blast.stringOutput || !options.outfmt.toString().match(/^(.)?5/);

    if (err) {
        return cb(err);
    }

    fs.readFile(outFile, 'utf8', (err, data)=> {
        if(isRaw){
            return cb(null, data);
        }

        parseString(data, (err, result) => {
            return cb(null, result);
        });
    });

}

export function blaster(type, db, query,op:option, cb) {

    var nonBlastOptions = ['type', 'outputDirectory', 'rawOutput','inputfileformat','outputfileformat'];
    var optArr:Array<string> = [];
    var guid = uuid.v1();
    var queryString;
    var opts= new option();

    //overiding the  old options default..
     _.merge(opts, op);

    queryString = query;

    if (!queryString) {
        return cb(new Error('Query must be supplied.'));
    }

    query = path.join(opts.outputDirectory, guid + '.'+opts.inputfileformat);
    op.out = path.join(opts.outputDirectory, guid + '.'+opts.outputfileformat);

    op.query=query;

    if(opts.remote) {
        opts.remote = '';
    }

    _.each(op, function(value, key) {
        if(nonBlastOptions.indexOf(key) > -1 || value===false){
            return;
        }
    //console.log("Key,Value=> "+key+" "+value);
        optArr.push('-' + key);
        optArr.push(value);
    });

    fs.writeFile(query, queryString, function(err) {
        if (err) {
            return cb(err);
        }
        run(op.type + ' ' + optArr.join(' '), function(err, stdOut, stdError) {
            postBlast(err, stdOut, stdError, op, cb);
        });

    });


}

export function run(toRun:String, cb){
    if (blast.customBlastLocation) {
        toRun = path.join(blast.customBlastLocation, toRun);
    }

    console.log('Blasting: ', toRun);
    exec(toRun, cb);
}


export class option implements IOption{

    type:string="blastn";
    outputDirectory:string="/tmp" ;
    rawOutput: boolean=false;
    db: string|boolean="testDB";
    outfmt: number=13;
    remote?:boolean |string=false ;
    out:string="";
    inputfileformat:string="fasta";
    outputfileformat:string="html";
    query:string="";

}
export interface IOption{

    type?:string|boolean;
    outputDirectory:String ;
    rawOutput:boolean;
    db: string|boolean;
    outfmt: number;
    remote?:boolean |string ;
    out?:string;
    inputfileformat:string;
    outputfileformat:string;
    query:string;


}

export class AliasOption implements IAliasOption{
    dblist:Array<string>=[];
    dbtype:string="nucl";
    out:string="";
    title:string="testAliasDB";
    directory:string=__dirname;
}

export interface IAliasOption{
    dblist:Array<string>;
    dbtype:string;
    out:string;
    title:string;
    directory:string;
}



module.exports = new blast();