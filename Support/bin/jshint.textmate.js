/*jshint asi:true*/

var QUICK = process.argv.indexOf('quick') >= 0

var JSHINT = require('./jshint').JSHINT
var BS = require('./bs').BS
var TextMate = require('./TextMate')

var FILEPATH = QUICK? process.env.TM_FILEPATH : process.env.TMPDIR + "validate.me.js"

process.stdin.resume()
process.stdin.setEncoding('utf8')

var CODE = ''

process.stdin.on('data', function(chunk){
    CODE += chunk
})

process.stdin.on('end', function(){
    if (JSHINT(''+CODE)) QUICK? quickPASS() : PASS()
    else QUICK? quickFAIL() : FAIL()
})

function quickPASS(){
    console.log(JSHINT.errors.length + ' Issues - JSHint')
}

function quickFAIL(){
    console.log(JSHINT.errors.length + ' Issues — JSHint')
}

function PASS(){
    
}

function FAIL(){
    // console.log(JSHINT.errors)
    console.log(''+BS('style',"\
        \
        table{\
            width: 100%;\
        }\
        \
        \
        tr:nth-child(even){\
            background-color: #f9f9f9;\
        }\
        \
        td,th{\
            font-weight: normal;\
            padding: .5ex 1ex;\
            text-align: left;\
            vertical-align: top;\
            overflow: hidden;\
            text-overflow: ellipsis;\
        }\
        \
        th{\
            min-width: 25ex;\
            text-align: right;\
        }\
        \
        td code{\
            white-space: pre;\
        }\
        \
    "))
    console.log('<table cellspacing=0>')
    JSHINT.errors.forEach(reportError)
    console.log('</table>')
}

function reportError(message){
    console.log
    ((''+BS('')
        ('tr',BS('')
            ('th',BS('')
                ('A'
                    // +' style="display:block;background:#eee;margin:1ex;"'
                    +' href="' + TextMate.href(process.env.TM_FILEPATH, message.line, message.character) + '"'
                    ,BS('')
                    ('', message.reason)
                )
            )
            ('td',BS('code', String(message.evidence).replace(/&/g,'&amp;').replace(/</g,'&lt;')))
        )
    ))
    
    // console.log(message)
    
    // (''+BS
    //     ('a style="display:block;background:#eee;margin:1ex;" href="' + TextMate.href(process.env.TM_FILEPATH, message.line, message.column) + '"',
    //         BS('span',
    //             BS('span', message.evidence)
    //         )
    //     )
    // )
}


