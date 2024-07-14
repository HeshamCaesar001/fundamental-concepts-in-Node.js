#!/usr/bin/env node
"use strict";
let util = require("util");
let path = require("path");
let fs = require("fs");
let Transform = require("stream").Transform;
let zlib = require("zlib");
let args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in", "out", "compress", "uncompress"],
  string: ["file"],
});
var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt");

if (process.env.HELLO) {
  log(process.env.HELLO);
}
if (args.help) {
  printHelp();
} else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
} else if (args.in || args._.includes("-")) {
  processFile(process.stdin);
} else {
  error("incorrect usage", true);
}
/******************************************/
function processFile(inStream) {
  var outStream = inStream; // this is readable
  if(args.uncompress){
	let gunzipStream = zlib.createGunzip();
	outStream = outStream.pipe(gunzipStream);
  }
  var upperStream = new Transform({
    // be writable
    transform(chunck, enc, cb) {
      this.push(chunck.toString().toUpperCase());
      // simple delay to show it wroks with chuncks
      // setTImeout(cb,800)
      cb();
    },
  });
  outStream = outStream.pipe(upperStream);
  if (args.compress) {
    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }
  var targetStream;
  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }
  outStream.pipe(targetStream);
}
function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}
function printHelp() {
  console.log("ex2 usage:");
  console.log(" ex2/js --file={FILENAME}");
  console.log("");
  console.log("--help                      print this help ");
  console.log("-, --in                     read file from stdin ");
  console.log("--file={FILENAME}           read file from {FILENAME} ");
  console.log("--out                       print to stdout ");
  console.log("--compress                  gzib the output ");
  console.log("--uncompress                un-gzib the input ");
  console.log("");
  console.log("");
}
