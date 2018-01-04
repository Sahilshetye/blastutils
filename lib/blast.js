"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="../../node_modules/fastautil/bin/index" />
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');
var uuid = require('uuid');
var parseString = require('xml2js').parsestring;
class blast {
    outputString(bool) {
        blast.stringOutput = !!(!bool || bool == true);
    }
    ;
    blastN(db, query, op, cb) {
        blaster('blastn', db, query, op, cb);
    }
    ;
    blastP(db, query, op, cb) {
        blaster('blastp', db, query, op, cb);
    }
    ;
    blastX(db, query, op, cb) {
        blaster('blastx', db, query, op, cb);
    }
    ;
    tblastN(db, query, op, cb) {
        blaster('tblastn', db, query, op, cb);
    }
    ;
    tblastX(db, query, op, cb) {
        blaster('tblastx', db, query, op, cb);
    }
    ;
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
        var fileNamePartOne = fileIn.replace(/^.*[\\\/]/, ''); // remove directories from path
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
    }
    ;
    blastDbAlias(option, cb) {
        var op = new AliasOption();
        _.merge(op, option);
        // op.dblist=option.dblist;
        // console.log(option.dbtype);
        var makeCommand = ' blastdb_aliastool -dblist "' + op.dblist.join(" ") + '" -dbtype ' + op.dbtype + ' -out ' + path.join(option.directory, option.out) + ' -title ' + option.title;
        var fileOut = option.out + option.title;
        run(makeCommand, (err, stdOut, stdErr) => {
            return cb(err, stdOut, stdErr, fileOut);
        });
    }
}
blast.stringOutput = false;
blast.customBlastLocation = "";
exports.blast = blast;
function lookupCustomBlastLocation() {
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
exports.lookupCustomBlastLocation = lookupCustomBlastLocation;
function postBlast(err, stdOut, stdError, options, cb) {
    var outFile = options.out;
    var isRaw = options.rawOutput || blast.stringOutput || !options.outfmt.toString().match(/^(.)?5/);
    if (err) {
        return cb(err);
    }
    fs.readFile(outFile, 'utf8', (err, data) => {
        if (isRaw) {
            return cb(null, data);
        }
        parseString(data, (err, result) => {
            return cb(null, result);
        });
    });
}
exports.postBlast = postBlast;
function blaster(type, db, query, op, cb) {
    var nonBlastOptions = ['type', 'outputDirectory', 'rawOutput', 'inputfileformat', 'outputfileformat', 'rawInput'];
    var optArr = [];
    var guid = uuid.v1();
    var queryString;
    var opts = new option();
    //overiding the  old options default..
    _.merge(opts, op);
    opts.rawInput = op.rawInput;
    if (!query) {
        return cb(new Error('Query must be supplied.'));
    }
    queryString = query;
    if (opts.rawInput)
        query = path.join(opts.outputDirectory, guid + '.' + opts.inputfileformat);
    else {
        // filepath with  correct extension should be passed in the  following  place.
        // query = opts.outputDirectory;
        if (!fs.lstatSync(query).isFile())
            return cb(new Error("outputDirectory is not valid File or File is not found. Pass the absolute path"));
        if (!query.includes(".fasta"))
            return cb(new Error("Please  pass a fasta file, Currently only supports only .fasta file"));
    }
    opts.out = path.join(opts.outputDirectory, guid + '.' + opts.outputfileformat);
    opts.query = query;
    if (opts.remote) {
        op.remote = '';
    }
    _.each(opts, function (value, key) {
        if (nonBlastOptions.indexOf(key) > -1 || value === false) {
            return;
        }
        //console.log("Key,Value=> "+key+" "+value);
        optArr.push('-' + key);
        optArr.push(value);
    });
    //console.log("inputRaw: "+opts.rawInput+ " RawInput: "+opts.rawInput)
    if (opts.rawInput) {
        fs.writeFile(query, queryString, function (err) {
            if (err) {
                return cb(err);
            }
            run(opts.type + ' ' + optArr.join(' '), function (err, stdOut, stdError) {
                fs.unlink(query, (err, cb) => {
                    postBlast(err, stdOut, stdError, opts, cb);
                });
            });
        });
    }
    else {
        run(opts.type + ' ' + optArr.join(' '), function (err, stdOut, stdError) {
            fs.unlink(query, (err, cb) => {
                postBlast(err, stdOut, stdError, opts, cb);
            });
        });
    }
}
exports.blaster = blaster;
function run(toRun, cb) {
    if (blast.customBlastLocation) {
        toRun = path.join(blast.customBlastLocation, toRun);
    }
    console.log('Blasting: ', toRun);
    exec(toRun, cb);
}
exports.run = run;
class option {
    constructor() {
        this.type = "blastn";
        this.outputDirectory = "/tmp";
        this.rawOutput = false;
        this.db = "testDB";
        this.outfmt = 13;
        this.remote = false;
        this.out = "";
        this.inputfileformat = "fasta";
        this.outputfileformat = "html";
        this.query = "";
        this.perc_identity = 100; //Trying to match the sequence exactly
        this.qcov_hsp_perc = 100; //Trying to match the sequence exactly
        this.rawInput = true;
    }
}
exports.option = option;
class AliasOption {
    constructor() {
        this.dblist = [];
        this.dbtype = "nucl";
        this.out = "";
        this.title = "testAliasDB";
        this.directory = __dirname;
    }
}
exports.AliasOption = AliasOption;
module.exports = new blast();
