#!/usr/bin/env node
/*jshint asi:true*/

exports.href = function(path, line, column){
    return "txmt://open?url=file://" + path + '&line='+line + '&column='+column
}

// exports.pathRegExp = RegExp('^' + process.env.HOME + '.*?\.js(?::(\d+)(?::(\d+))?)?', 'g');
// exports.pathRegExp = /\B((?:\/\b(?:[\(\)\w._-]+(?:\b \b[\(\)\w._-]+)*\b)){2,})(?!>)(?::(\d+)(?::(\d+))?)?/g;
exports.pathRegExp = /(\/(?:sbin|home|net|tmp|System|opt|Network|usr|private|Users|Volumes|bin|Library|Applications)\/.+?\.(?:json|js|jsx|jsxinc|xjs|coffee))(?::(\d+)(?::(\d+))?)?/g;

exports.linkPaths = function(html){
    return String(html)
        // .replace(/(\.*\/[^\n(){},'"]+?):(\d+)(?::(\d+))?/g, exports.linkPath)
        // .replace(exports.pathRegExp, exports.linkPath)
        .replace(exports.pathRegExp, exports.linkPath)
    
    /*
        YES
        /foo
        NO
        f/foo
        //aasdas
    */
}

exports.linkPath = function(match, path, line, column){
    return '<a tabindex=0 style="padding-left:.5ex;border-left:2.3ex solid ' + exports.uniqueColorFor(path + line) + ';" href="' + exports.href(path, line, column) + '">' + match.replace(process.env.TM_DIRECTORY+'/', '') + '</a><script>document.getElementsByTagName("a")[0].focus()</script>'
}

exports.uniqueColorFor_cache = {}
exports.uniqueColorFor = function(thing){
    return exports.uniqueColorFor_cache[thing] || (exports.uniqueColorFor_cache[thing] = 'hsl(' + Math.random() * 360 + ', 50%, 50%)')
}

var matchHome = RegExp(process.env.HOME,'g')

exports.expandFileNameToPath = function(fileName){
    return process.installPrefix + '/lib/' + fileName
}

if (module.id == '.') {
    require('assert').equal(
        exports.linkPaths('/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js:90:60'),
        exports.linkPath('/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js:90:60'
                        ,'/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js',90,60)
    )

    require('assert').equal(
        exports.linkPaths
            ("node.js:183\n\
                    throw e; // process.nextTick error, or 'error' event on first tick\n\
                    ^\n\
            TypeError: Cannot read property 'className' of undefined\n\
                at isClobberedBy (/Users/thomas/Projects/Sencha/SDK/build/lib/discover-metaclass.js:114:14)\n\
                at isClobberedBy (/Users/thomas/Projects/Sencha/SDK/build/lib/discover-metaclass.js:119:15)\n\
                at isClobberedBy (/Users/thomas/Projects/Sencha/SDK/build/lib/discover-metaclass.js:119:15)\n\
                at Function.isClobberedBy (/Users/thomas/Projects/Sencha/SDK/build/lib/discover-metaclass.js:119:15)\n\
                at Object.<anonymous> (/Users/thomas/Projects/Sencha/SDK/build/lib/discover-metaclass.js:166:32)\n\
                at Module._compile (module.js:423:26)\n\
                at Object..js (module.js:429:10)\n\
                at Module.load (module.js:339:31)\n\
                at Function._load (module.js:298:12)\n\
                at Array.<anonymous> (module.js:442:10)"
            ).match(/txmt:/g).length
        ,5
    )

    require('assert').equal(
        exports.linkPaths('/Users/aylott/Dropbox/Work/node-headless-inspector/demo-chrome.js:17:22'),
        exports.linkPath('/Users/aylott/Dropbox/Work/node-headless-inspector/demo-chrome.js:17:22'
                        ,'/Users/aylott/Dropbox/Work/node-headless-inspector/demo-chrome.js',17,22)
    )

    // require('assert').equal(
    //     exports.linkPaths('/Users/aylott/Dropbox (Personal)/Work/node-headless-inspector/demo-chrome.js:17:22'),
    //     exports.linkPath('/Users/aylott/Dropbox (Personal)/Work/node-headless-inspector/demo-chrome.js:17:22'
    //                     ,'/Users/aylott/Dropbox (Personal)/Work/node-headless-inspector/demo-chrome.js',17,22)
    // )

    try {
	    var action = process.argv[2] || process.env.TM_SELECTED_TEXT
	    var args = process.argv.slice(3)
	    
	    if (exports[action]) {
            process.stdin.resume();
            process.stdin.on('data', function(data){
                process.stdout.write(exports[action].apply(null, [data].concat(args)))
            })
	    } else {
	        console.warn(exports)
	    }
    } catch(e){
        console.error(exports)
        process.exit(1)
    }
}
