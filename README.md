# blastutils
[![Build Status](https://travis-ci.org/TeamMacLean/blastjs.svg?branch=master)](https://travis-ci.org/TeamMacLean/blastjs)
>a BLAST+ wrapper(inspired from blastjs) for Node.js

This  version of blastjs is rewritten in ts for better  scalability.
Additional commands like blastdb_aliasing is also  added for  usage.

## Install

If you do not have Node.js installed you can get it at [https://nodejs.org](https://nodejs.org)

```bash
npm install blastutils
```

If Blast+ is not installed you can run:    
```bash
node util/getBlast.js
```
and the latest version of Blast+ will be downloaded and placed in the bin folder for you.

## Usage
### make database

```javascript
var blast = require('blastutils');

var type = 'nucl';
var fileIn = './test.fasta';
var outPath = './';
var name = 'example';



blast.makeDB(type, fileIn, outPath, name, function(err){
  if(err){
    console.error(err);   
  } else {
    console.log('database created at', outPath);
  }
});
```

### blast n
```javascript
var blast = require('blastutils');

blast.outputString(true); //optional, provides string output instead of JSON

var dbPath = './example';
var query = '>24.6jsd2.Tut\nGGTGTTGATCATGGCTCAGGACAAACGCTGGCGGCGTGCTTAATACATGCAAGTCGAACGGGCTACCTTCGGGTAGCTAGTG'
+'\n>24.6jsd3.Tut\nATGATCATGGCTCAGATTGAACGCTGGCGGCATGCCTTACACATGCAAGTCGAACGGCAGCACGGGGAAGGGGCAACTCTTT';
var dbPath = path.join(__dirname + '/example');

var option={
    type:"blastn",
    outputDirectory:__dirname + "/results/" ,
    rawOutput:true,
    db:path.join(__dirname + '/example'),
    outfmt:12,
    query:Nquery,
    remote:false,
    outputfileformat:"json"
}

var Alias={
    dblist:['example','exampleProtein'],
    dbtype:"nucl",
    out:"aliasdb",
    title:"aliasdb",
    directory:__dirname

}


blast.blastN(dbPath, query,option, function (err, output) {
  if(!err){
    console.log(output);
  }
});

```

## API
* .makeDB(type, fileIn, outPath, name, cb)    
  callback is passed (err, stdOut, stdErr, fileOut).
  
* .blastN(db, query,option, cb)    
  callback is passed (err, output).
  
* .blastP(db, query,option, cb)    
  callback is passed (err, output).
  
* .blastX(db, query,option, cb)    
  callback is passed (err, output).
  
* .tblastN(db, query,option, cb)    
  callback is passed (err, output).
  
* .tblastX(db, query,option, cb)    
  callback is passed (err, output).
  
* .outputString(boolean)    
  this toggles the output being in a string (true) or as JSON (false).    
  default is JSON.
  
* .blastDbAlias(Alias,cb)
   Pass the  Alias options based on the blastdb_alias options.
   For Reference check this [blastdb_aliastools](https://www.ncbi.nlm.nih.gov/books/NBK279693/#cookbook.Aggregate_existing_BLAST_databa)
   or type 
   ```bash
    blastdb_aliastools -help
   ```
   
   callback is passed (err, stdOut, stdErr, fileOut).

