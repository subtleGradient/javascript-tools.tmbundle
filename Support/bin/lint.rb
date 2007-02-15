#!/usr/bin/env ruby
FILENAME = ENV['TM_FILENAME']
FILEPATH = ENV['TM_FILEPATH']
SUPPORT  = ENV['TM_BUNDLE_SUPPORT']
BINARY   = `uname -a` =~ /i386/ ? "#{SUPPORT}/bin/intel/jsl" : "#{SUPPORT}/bin/ppc/jsl"

output = `"#{BINARY}" -process "#{FILEPATH}" -nologo -conf "#{SUPPORT}/conf/jsl.textmate.conf"`

output.gsub!('lint warning:', '<span class="warning">Warning:</span>')
output.gsub!('SyntaxError:', '<span class="error">Syntax Error:</span>')
output.gsub!('Error:', '<span class="error">Error:</span>')
output.gsub!(FILENAME, '')

output  = output.split(/\n/)
# the "X error(s), Y warning(s)" line will always be at the end
results = output.pop

output  = output.join("\n")

output  = output.split(/\n\n/)
output  = output.map do |chunk|
  chunk.strip!
  next if chunk.length == 0
  lines = chunk.split(/\n/)
  j = 0
  lines = lines.map do |line|
    if line =~ /^(\d+):/
      column = (lines[j+2].rindex("^") + 1).to_s
      line.gsub!(/^(\d+):/, '<a href="txmt://open?url=file://#{FILEPATH}&line=\1&column=#{column}">\1</a>')
      # TODO: figure out why I can't use bracketed expressions and 
      #       regexp captures within the same string
      line.gsub!('#{column}', column);
      line.gsub!('#{FILEPATH}', FILEPATH);
    end
    j += 1
    line
  end
  
  # don't do the transformation on an empty string
  if (chunk.length > 0)
    chunk = "<li>#{lines[0]}<pre><code>#{lines[1]}\n#{lines[2]}</code></pre></li>"
  end
  chunk
end
output = output.join("\n\n")

html = <<WTF
<html>
  <head>
    <title>JavaScript Lint Results</title>
    <style type="text/css">
      body {
        font-size: 13px;
      }
      
      pre {
        background-color: #eee;
        color: #400;
        margin: 3px 0;
      }
      
      h1, h2 { margin: 0 0 5px; }
      
      h1 { font-size: 20px; }
      h2 { font-size: 16px;}
      
      span.warning {
        color: #c90;
        text-transform: uppercase;
        font-weight: bold;
      }
      
      span.error {
        color: #900;
        text-transform: uppercase;
        font-weight: bold;
      }
      
      ul {
        margin: 10px 0 0 20px;
        padding: 0;
      }
      
      li {
        margin: 0 0 10px;
      }
    </style>
  </head>
  <body>
    <h1>JavaScript Lint</h1>
    <h2>#{results}</h2>
    
    <ul>
      #{output}
    </ul>
  </body>
</html>  
WTF

puts html