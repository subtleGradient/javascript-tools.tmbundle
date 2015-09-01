#!/usr/bin/env bash
# Forked from https://github.com/tlrobinson/narwhal-photoshop by Tom Robinson

SCRIPT="$(cat)"

stdout_fifo="$TMPDIR/photoshop-$$-stdout"
stderr_fifo="$TMPDIR/photoshop-$$-stderr"

rm -f "$stdout_fifo"
rm -f "$stderr_fifo"

mkfifo "$stdout_fifo"
mkfifo "$stderr_fifo"

cat "$stdout_fifo" > /dev/stdout &
cat "$stderr_fifo" > /dev/stderr &

osascript \
-e 'on run argv' \
-e   'tell application "Adobe Photoshop CC 2014" to do javascript (item 1 of argv) -- show debugger on runtime error' \
-e 'end run' \
"
__stdout__ = new File('$stdout_fifo')
__stdout__.open('w')
$.write = function(){return __stdout__.write.apply(__stdout__, arguments)}
$.writeln = function(){return __stdout__.writeln.apply(__stdout__, arguments)}

__stderr__ = new File('$stderr_fifo')
__stderr__.open('w')

try {
  $SCRIPT
}
catch(e){
  __stderr__.writeln(e)
  e
}
"

rm "$stdout_fifo"
rm "$stderr_fifo"
