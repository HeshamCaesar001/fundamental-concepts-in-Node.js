#!/usr/bin/env node
"use strict";
let util = require("util");
let path = require("path");
let fs = require("fs");
let getStdin = require("get-stdin");
const { log } = require("console");
let args = require("minimist")(process.argv.slice(2),{
		boolean:['help',"in"],
		string:['file']
});
var BASE_PATH = path.resolve(
	process.env.BASE_PATH || __dirname
)
if(process.env.HELLO){
	log(process.env.HELLO);
}
if(args.help){
	printHelp();
}
else if (args.file){
// returning callback from reading file not sync
	 fs.readFile(path.join(BASE_PATH,args.file),function onContents(err,contents){
	 	if(err){ 
	 		error(err.toString());
	 	}else{
			processFile(contents)

	 	}
	 });
} else if (args.in || args._.includes("-")){
	getStdin().then(processFile).catch(error);
}
else{
	error("incorrect usage",true);
}
/******************************************/
function processFile(contents){
	contents = contents.toString().toUpperCase();
	process.stdout.write(contents);
}
function error(msg,includeHelp=false){
	console.error(msg);
	if(includeHelp){
		console.log("");
		printHelp();
	}
}
function printHelp() {
	console.log("ex1 usage:");
	console.log("");
	console.log("--help                      print this help");
	console.log("-, --in                     read file from stdin");
	console.log("--file={FILENAME}           read file from {FILENAME}");
	console.log("");
	console.log("");
}
