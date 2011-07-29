#!/usr/bin/env node
/*jshint asi:true*/

exports.href = function(path, line, column){
    return "txmt://open?url=file://" + path + '&line='+line + '&column='+column
}

exports.linkPaths = function(html){
    return String(html)
        .replace(/(\.*\/[^\n]+?):(\d+)(?::(\d+))?/, exports.linkPath)
}

exports.linkPath = function(match, path, line, column){
    return '<a href="' + exports.href(path, line, column) + '">' + match.replace(matchHome, '~') + '</a>'
}

var matchHome = RegExp(process.env.HOME,'g')

exports.expandFileNameToPath = function(fileName){
    return process.installPrefix + '/lib/' + fileName
}

require('assert').equal(
    exports.linkPaths('/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js:90:60'),
    exports.linkPath('/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js:90:60'
                    ,'/Users/thomas/Projects/Sencha/SDK/build/bin/build-bootstraps-2.js',90,60)
)

if (module.id == '.') {
    try {
	    var action = process.argv[2]
	    
        process.stdin.resume();
        process.stdin.on('data', function(data){
            process.stdout.write(exports[action](data))
        })
    } catch(e){
        console.error(exports)
        process.exit(1)
    }
}
