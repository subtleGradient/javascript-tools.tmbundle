#!/usr/bin/env node
/*jslint adsafe: false, bitwise: true, browser: true, cap: false, css: false,
  debug: false, devel: true, eqeqeq: true, es5: false, evil: true,
  forin: false, fragment: false, immed: true, laxbreak: false, newcap: true,
  nomen: false, on: false, onevar: true, passfail: false, plusplus: true,
  regexp: false, rhino: true, safe: false, strict: true, sub: false,
  undef: true, white: false, widget: false, windows: false */
/*global process: false, require: false */
"use strict";

/*

### JS Beautifier node command line script

Ported to use node by Carlo Zottmann, <carlo@municode.de>.  Original Rhino
version written by Patrick Hof, <patrickhof@web.de>.

This script is to be run with node[^1] on the command line.

Usage:

    node beautify-node.js

You are free to use this in any way you want, in case you find this useful
or working for you.

[^1]: http://nodejs.org/

*/


require.paths.unshift( "./" );


( function() {
  
  var fs = require( "fs" ),
    sys = require( "sys" ),
    http = require( "http" ),
    url = require( "url" ),
    jsb = require( "./beautify.js" ),
    options,
    result = "";


  function printUsage() {
    sys.puts( [
      "Usage: jsbeautify [options] [file || URL || STDIN]",
      "",
      "Reads from standard input if no file or URL is specified.",
      "",
      "Options:",
      "-i NUM\tIndent size (1 for TAB)",
      "-b\tPut braces on own line (Allman / ANSI style)",
      "-a\tIndent arrays",
      "-n\tPreserve newlines",
      "-p\tJSLint-pedantic mode, currently only adds space between \"function ()\"",
      "",
      "-h\tPrint this help",
      "",
      "Examples:",
      "  beautify-node.js -i 2 example.js",
      "  beautify-node.js -i 1 http://www.example.org/example.js",
      "  beautify-node.js < example.js"
    ].join( "\n" ) );
  }


  function parseOpts( args ) {
    var options = [],
      param;

    args.shift();
    args.shift();

    while ( args.length > 0 ) {
      param = args.shift();

      if ( param.substr( 0, 1 ) === "-" ) {
        switch ( param ) {
          case "-i":
            options.indent = args.shift();
            break;

          case "-b":
            options.braces_on_own_line = true;
            break;

          case "-a":
            options.keep_array_indentation = false;
            break;

          case "-p":
            options.jslint_pedantic = true;
            break;

          case "-n":
            options.preserve_newlines = true;
            break;

          case "-h":
            printUsage();
            process.exit();
            break;

          default:
            console.error( "Unknown parameter: " + param + "\nAborting." );
            process.exit( 0 );
        }
      }
      else {
        options.source = param;
      }
    }
    
    return options;
  }


  function beautifySource( sourceFile ) {
    var line,
      indent_size = options.indent || 2,
      indent_char = ( indent_size === 1 ) ? "\t" : " ";

    sourceFile = sourceFile.replace( /^\s+/, "" );

    if ( sourceFile && sourceFile[0] === "<" ) {
      sys.puts( "HTML files not supported." );
      process.exit( 0 );
    }
    else {
      result = jsb.js_beautify( sourceFile, {
        indent_size: indent_size,
        indent_char: indent_char,
        preserve_newlines: !!options.preserve_newlines,
        space_after_anon_function: options.jslint_pedantic,
        keep_array_indentation: options.keep_array_indentation,
        braces_on_own_line: options.braces_on_own_line
      });
    }

    // Trying to output `result` in one go had funny side effects on OSX.
    // Writing to a file would work fine, but the raw console output (printed
    // on screen) was truncated.  Really weird.  So, line by line it is.
    
    result.split( "\n" ).forEach( function( line, index, array ) {
      sys.puts( line );
    });
  }


  function getSourceFile() {
    var req,
      sourceFile = "",
      sURL,
      stdin;

    if ( options.source ) {
      if ( options.source.substring( 0, 4 ) === "http" ) {

        // remote file
        sURL = url.parse( options.source );
        req = http
          .createClient( ( sURL.port || 80 ), sURL.host )
          .request( "GET", sURL.pathname + ( sURL.search || "" ), { host: sURL.hostname });
        req.end();
        req.on( "response", function( response ) {
          response.setEncoding( "utf8" );
          response
            .on( "data", function( chunk ) {
              sourceFile += chunk;
            })
            .on( "end", function() {
              beautifySource( sourceFile );
            });

          // TODO: error handling
        });
      }
      else {

        // local file
        sourceFile = fs.readFileSync( options.source, "utf-8" );
        beautifySource( sourceFile );
      }
    }
    else {

      // I'll be honest: I don't know yet how to check whether there is any
      // STDIN or not.  When the script is called w/o parameters, it should
      // print out usage information; when there's STDIN input, it should
      // process that.  So I figured that when there's no such input within 
      // 25ms, there won't be anything later on, either.  If you know of a 
      // cleaner way to do this, please let me know.  :)  --Carlo
      
      setTimeout( function() {
        if ( sourceFile.length === 0 ) {
          printUsage();
          process.exit( 1 );
        }
      }, 25 );

      stdin = process.openStdin();
      stdin.setEncoding( "utf8" );
      stdin
        .on( "data", function( chunk ) {
          sourceFile += chunk;
        })
        .on( "end", function() {          
          beautifySource( sourceFile );
        });
    }
  }

  options = parseOpts( process.argv );
  getSourceFile();
  
}() );
