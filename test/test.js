var assert = require("assert");
var blast = require('../index.js');
var path = require('path');

var Nquery=`>gi|585100493|gb|EWM20678.1| plant [Nannochloropsis gaditana]
GAAGAGTTTGATCCTGGCTTAGAACTAACGCTGGCAGTGCGTCTTAAGCA
TGCAAGTCAAACGGGATGTAGCAATACATTCAGTGGCGAACGGGTGAGTA
ACGCGTGGATGATCTACCTATGAGATGGGGATAACTATTAAAAATAGTAG
CTAATACCGAATAAGGTCAGTTAATTTGTTAATTGATGAAAGGAAGCCTT
TAAAGCTTCGCTTGTAGATGAGTCTGCGTCTTATTAGCTAGTTGGTAGGG
TAAATGCCTACCAAGGCAATGATAAGTAACCGGCCTTAGAGGGTGAACGG
TCACACTGGAACTGAGATACGGTCCAGACTCCTACGGGAGGCAGCAGCTA
AGAATCTTCCGCAATGGGCGAAAGCCTGACGGAGCGACATTGCGTGAATG
AAGAAGGTCGAAAGATTGTAAAATTCTTTTATAAATGTAGGAATAAGCTTT
GTAGGAAATGACAAAGTGATGACGTTAATTTATGAATAAGCCCCGGCTAA
TTACGTGCCAGCAGCCGCGGTAATACGTAAGGGGCGAGCGTTGTTCGGGA
TTATTGGGCGTAAAGGGTGAGTAGGCGGATATATAAGTCTATGCATAAAA
TACCACAGCTCAACTGTGGACCTATGTTGGAAACTATATGTCTAGAGTCT
GATAGAGGAAGTTAGAATTTCTGGTGTAAGGGTGGAATCTGTTGATATCA
GAAAGAATACCGGAGGCGAAGGCGAACTTCTGGGTCAAGACTGACGCTGA
GTCACGAAAGCGTAGGGAGCAAACAGGATTAGATACCCTGGTAGTCTACG
CTGTAAACGATGCACACTTGGTGTTAACTAAAAGTTAGTACCGAAGCTAA
CGTGTTAAGTGTGCCGCCTGGGGAGTATGCTCGCAAGAGTGAAACTCAAA
GGAATTGACGGGGGCCCGCACAAGCGGTGGAGCATGTGGTTTAATTCGAT
GATACGCGAGGAACCTTACCAGGGCTTGACATATATAGGATATAGTTAGA
GATAATTATTCCCCGTTTGGGGTCTATATACAGGTGCTGCATGGTTGTCG
TCAGCTCGTGCTGTGAGGTGTTGGGTTAAGTCGGCAACGAGCGCAACCC
TTGTTATCTGTTACCAGCATGTAATGGTGGGGACTCAGATAAGACTGCCG
GTGATAAGTCGGAGGAAGGTGAGGATGACGTCAAATCATCATGGCCCTTA
TGTCCTGGGCTACACACGTGCTACAATGGCCTGTACAAAGCGAAGCGAAA
CAGTGATGTGAAGCAAAACGCATAAAGCAGGTCTCAGTCCGGATTGAAGT
CTGAAACTCGACTTCATGAAGTTGGAATCGCTAGTATCCGTATATCAGAA
TGATACGGTGAATACGTTCTCGGGCCTTGTACACACCGCCCGTCACACCA
CCCGAGTTGAGGATACCCGAAGCTATTATTCTAACCCGTAAGGGAGGAAG
GTATTTAAGGTATGTTTAGTGAGGGGGGTGAAGTCGTAACAAGGTAGCCG
TACTGGAAAGTGCGGCTGGATCACCTCCTT`;

// var Nquery = 'AGTTTGATCATGGCTCAGAATGAACGAAAGCGGCATGGATTAGGCATGCAAGTCGTGCGCGAAACGTAGCAATACGTGGAGAGCGGCGAAAGGGAGAGGAATACGTGGGAACCTACCTCGGGGCCTGGAATAGCGGCGGGAAACTGCCGGTAATGCCAGATAACGTCTCCGGACCAAAGGTGTGATTCCGCCTGGAGATGGGCCCACGTCCTATCAGCTAGTTGGTGTGGTAACGGCGCACCAAGGCTAAGACGGGTATGGGGTGTGAGAGCATGCCCCCACTCACTGGGACTGAGACACTGCCCAGACACCTACGGGTGGCTGCAGTCGAGAATCTTCGGCGATGAGTTCAAGCTTGACCGAGCGATGCCGCGTGCGGGATGAAGGCCCTCGGGTTGTAAACCGCTGTCGTAGGGGAATAAAGGTCGGTGGGTTCTCCCACCGATTTGAATGATCCTAGGAGGAAGGACGGGCTAAGTTCGTGCCAGCAGCCGCGGTAAGACGAACCGTCCAAACGTTATTCGGAATCAGAGGGCTTACAGAGTTCGTAGGCGGTCTGGAAAGTTGGGTGTGAAATCCCTCGGCTCAACCGAGGAACTGCGCTTGAAACTACCAGACTCGAGGGGGATAGAGGAAAGCGGAACTGATGGTGGAGCGGTGAAATGCGTTGATATCATCAGGAACACCGGTGGCGAAGGCGGCTTTCTGGGTCTTACCTGACGCTGAGGAACGAAAGCCAGGGGAGCGAACGGGATTAGATACCCCGGTAGTCCTGGCCGTAAACGATGAGCACTAGGTCGTGGGCCTCCACAGGCCCTCGGCCGTAGCGAAAGTGTTAAGCGCTCCGCCTGGGGAGTATGGTCGCAAGGCTGAAACTCAAAGGAATTGACGGGGGCCCGCACAAGCCACGGAGCATGTGGATTAATTCGATGCAACGCGAAGAACCTTACCTGGGTTTGACATGCACCAGATATCCCTAGAGATAGGGCTTCCCTTGTGGTTGGTGTGCAGGTGGTGCATGGCTGTCGTCAGCTCGTGTCGTGAGATGTTGGGTTAAGTCCCGCAACGAGCGCAACCCTCGTTCCATGTTGCCAGCACGTAATGGTGGGGACTCATGGGAGACTGCCGGGGTCAACTCGGAGGAAGGTGGGGATGACGTCAAGTCATCATGCCCCTTATGTCCAGGGCTTCACACATGCTACAATGGCCGGTACAGAGGGTTGCGAGACCGTGAGGTGGAGCGAATCCCTTAAAGCCGGTCTCAGTTCGGATCGGGGTCTGCAACTCGACCCCGTGAAGTCGGAGTCGCTAGTAATCGCAGATCAGCAACGCTGCGGTGAATACGTTCCCGGGCCTTGTACACACCGCCCGTCACGTCACGAAAGTCGGTAACACCCGAAGCCCATGGCCCAACCCCTTTTTGGGGAGGGAGTGGTCGAAGGTGGGACTGGCGATTGGGACGAAGTCGTAACAAGGTAACAGCGCGCGTAGGTGGTTTGTTAAGTTGAATGTGAAATCCCCGGGCTCAACCTGGGAACTGCATCCAAAACTGGCAAGCTAGAGTATGGTAGAGGGTGGTGGAATTTCCTGTGTAGCGGTGAAATGCGTAAATATAGGAAGGAACACCAGTGGCGAAGGCGACCACCTGGACTGATACTGACACTGAGGTGCGAAAGCGTGGGGAGCAAACAGGATTAGATACCCTGGTAGTTCACGCCGTAAACGATGTCAACTAGCCGTTGGGAGCCTTGAGCTCTTAGTGGCGCAGCTAACGCATTAAGTTGACCGCCTGGGGAGTACGGCCGCAAGGTTAAAACTCAAATGAATTGACGGGGGCCCGCACAAGCGGTGGAGCATGTGGTTGAATTCGAAGCAACGCGAAGAACCTTACCAGGCCTTGACATCCAATGAACTTTCCAGAGATGGATTGGTGCCTTCGGGAACATTGAGACAGGTGCTGCATGGCTGTCGTCAGCTCGTGTCGTGAGATGTTGGGTTAAGTCCCGTAACGAGCCCAACCCTTGTCCTTAGTTACCAGCACGTTAAGGTGGGCACTCTAAGGAGACTGCCGGTGACAAACCGGAGGAAGGTGGGGATGACGTCAAGTCATCATGGCCCTTACGGCCTGGGCTACACACGTGCTACAATGGTCGGTACAGAGGGTTGCCAAGCGCGAGGTGGAGCTAATCTCACAAAACCGATCGTAGTCCGGATCGCAGTCTGCAACTCGACTGCGTGAAGTCGGAATCGCTAGTAATCGCGAATCAGAATGTCGCGGTGAATACGTTCCCGGGCCTTGTACACACCGCCCGTCACACCATGGGAGTGGGTTGCACCAGAAGTAGCTAGTCTAACCTTCGGGGGGACGGTTACCACGGTGTGATTCATGGAAGAGTTTGATCCTGGCTTAGAACTAACGCTGGCAGTGCGTCTTAAGCATGCAAGTCAAACGGGATGTAGCAATACATTCAGTGGCGAACGGGTGAGTAACGCGTGGATGATCTACCTATGAGATGGGGATAACTATTAAAAATAGTAGCTAATACCGAATAAGGTCAGTTAATTTGTTAATTGATGAAAGGAAGCCTTTAAAGCTTCGCTTGTAGATGAGTCTGCGTCTTATTAGCTAGTTGGTAGGGTAAATGCCTACCAAGGCAATGATAAGTAACCGGCCTTAGAGGGTGAACGGTCACACTGGAACTGAGATACGGTCCAGACTCCTACGGGAGGCAGCAGCTAAGAATCTTCCGCAATGGGCGAAAGCCTGACGGAGCGACATTGCGTGAATGAAGAAGGTCGAAAGATTGTAAAATTCTTTTATAAATGTAGGAATAAGCTTTGTAGGAAATGACAAAGTGATGACGTTAATTTATGAATAAGCCCCGGCTAATTACGTGCCAGCAGCCGCGGTAATACGTAAGGGGCGAGCGTTGTTCGGGATTATTGGGCGTAAAGGGTGAGTAGGCGGATATATAAGTCTATGCATAAAATACCACAGCTCAACTGTGGACCTATGTTGGAAACTATATGTCTAGAGTCTGATAGAGGAAGTTAGAATTTCTGGTGTAAGGGTGGAATCTGTTGATATCAGAAAGAATACCGGAGGCGAAGGCGAACTTCTGGGTCAAGACTGACGCTGAGTCACGAAAGCGTAGGGAGCAAACAGGATTAGATACCCTGGTAGTCTACGCTGTAAACGATGCACACTTGGTGTTAACTAAAAGTTAGTACCGAAGCTAACGTGTTAAGTGTGCCGCCTGGGGAGTATGCTCGCAAGAGTGAAACTCAAAGGAATTGACGGGGGCCCGCACAAGCGGTGGAGCATGTGGTTTAATTCGATGATACGCGAGGAACCTTACCAGGGCTTGACATATATAGGATATAGTTAGAGATAATTATTCCCCGTTTGGGGTCTATATACAGGTGCTGCATGGTTGTCGTCAGCTCGTGCTGTGAGGTGTTGGGTTAAGTCGGCAACGAGCGCAACCCTTGTTATCTGTTACCAGCATGTAATGGTGGGGACTCAGATAAGACTGCCGGTGATAAGTCGGAGGAAGGTGAGGATGACGTCAAATCATCATGGCCCTTATGTCCTGGGCTACACACGTGCTACAATGGCCTGTACAAAGCGAAGCGAAACAGTGATGTGAAGCAAAACGCATAAAGCAGGTCTCAGTCCGGATTGAAGTCTGAAACTCGACTTCATGAAGTTGGAATCGCTAGTATCCGTATATCAGAATGATACGGTGAATACGTTCTCGGGCCTTGTACACACCGCCCGTCACACCACCCGAGTTGAGGATACCCGAAGCTATTATTCTAACCCGTAAGGGAGGAAGGTATTTAAGGTATGTTTAGTGAGGGGGGTGAAGTCGTAACAAGGTAGCCGTACTGGAAAGTGCGGCTGGATCACCTCCTT';

var dbPath = path.join(__dirname + '/example');
var option={
    type:"blastn",
    outputDirectory:path.join(__dirname ,"/results/") ,
    rawOutput:false,
    db:path.join(__dirname + '/example'),
    outfmt:12,
    query:Nquery,
    remote:false,
    outputfileformat:"json",
    rawInput:true
}
var Alias={
    dblist:['example','exampleProtein'],
    dbtype:"prot",
    out:"aliasdb",
    title:"aliasdb",
    directory:__dirname

}

var fastaoption={
    type:"blastn",
    outputDirectory:path.join(__dirname ,"/results/") ,
    rawOutput:false,
    db:path.join(__dirname + '/example'),
    outfmt:12,
    query:path.join(__dirname,'/fastatest.fasta'),
    remote:false,
    outputfileformat:"json",
    rawInput:false
}

describe('blast', function () {
    this.timeout(15000);
    describe('#makeDB', function () {
        it('should not get an error', function (done) {
            var fileIn = path.join(__dirname + '/example.fasta');
            var outPath = __dirname;
            var name = 'example';
            blast.outputString(true);
            blast.makeDB('prot', fileIn, outPath, name, function (err, stdOut, stdErr, fileOut) {
                //console.error('err',err);
                assert.equal(err, null);

            })
            done();
        });
    });
    describe('#blastN', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            option.type="blastn";
            blast.blastN(dbPath, Nquery,option, function (err, output) {
                console.log(output);

                assert.equal(err, null);

            });
            done();
        });
    });


    describe('#blastP', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            option.type="blastp";
            blast.blastP(dbPath, Nquery,option, function (err, output) {
                console.log(output);

                assert.equal(err, null);

            });
            done();
        });
    });
    describe('#blastX', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            option.type="blastx";
            blast.blastX(dbPath, Nquery,option, function (err, output) {
                console.log(output);

                assert.equal(err, null);
                // console.log("Console is: "+output);

            });
            done();
        });
    });
    describe('#tblastP', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            option.type="blastp";
            blast.tblastN(dbPath, Nquery,option, function (err, output) {
                assert.equal(err, null);



            });
            done();
        });
    });
    describe('#tblastx', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            option.type="blastx";
            // option.remote=true;
            blast.tblastX(dbPath, Nquery,option, function (err, output) {
                assert.equal(err, null);
                console.log(output);


            });
            done();
        });
    });

    describe('blastdb_aliastool', function () {
        it('new Blast alias is created', function (done) {
            blast.outputString(true);

            blast.makeDB('prot', path.join(__dirname,'/example.fasta'), path.join(__dirname,'/'), "testDB1", function (err, stdOut, stdErr, fileOut) {
                // console.error('err',err);
            });
            blast.makeDB('prot', path.join(__dirname,'/exampleProtein.fasta'), path.join(__dirname,'/'), "testDB2", function (err, stdOut, stdErr, fileOut) {
                // console.error('err',err);
            });

            // option.remote=true;
            blast.blastDbAlias(Alias, function (err, stdOut, stdErr, fileOut) {
                // console.log("OP is :"+fileOut);
                assert.equal(err, null);
            });
            done();
        });
    });
    describe('#blastNnotRaw', function () {
        it('should not get an error', function (done) {
            blast.outputString(true);
            //fastaoption.type="blastn";
            //fastaoption.rawInput=false;
            blast.blastN(dbPath, fastaoption.query,fastaoption, function (err, output) {
               // console.log(output);
                //console.log("Answer is : "+fastaoption.rawInput.valueOf);

                assert.equal(err, null);

            });
            done();
        });
    });

    describe('#blastNotVAlidfile', function () {
        it('should get an error with not valid file', function (done) {
            blast.outputString(true);
            //fastaoption.type="blastn";
            //fastaoption.rawInput=false;            
            blast.blastN(dbPath, fastaoption.query,fastaoption, function (err, output) {
                //console.log(output);

                assert.equal(err.message, "outputDirectory is not valid File or File is not found. Pass the absolute path");

            });
            done();
        });
    });
    describe('#blastNotValidFastaFile', function () {
        it('should get an error with fasta file not used error', function (done) {
            blast.outputString(true);
            //fastaoption.type="blastn";
            //fastaoption.rawInput=false;            
            blast.blastN(dbPath, fastaoption.query,fastaoption, function (err, output) {
               // console.log(output);
                // console.log(err.message);
                
              assert.equal(err.message,"Please  pass a fasta file, Currently only supports only .fasta file" );

            });
            done();
        });
    });

});
