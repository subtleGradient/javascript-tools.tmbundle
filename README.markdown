JavaScript Tools TextMate Bundle
===

Help
---

Opens this help file.

Run Javascript (⌘R)
---

Attempts to run the current javascript document or selection in TextMate's Web Preview window.

Javascript Lint
---

> JSLint takes a JavaScript source and scans it. If it finds a problem, it returns a message describing the problem and an approximate location within the source. The problem is not necessarily a syntax error, although it often is. JSLint looks at some style conventions as well as structural problems. It does not prove that your program is correct. It just provides another set of eyes to help spot problems. - <http://www.jslint.com/lint.html>

* **Validate Syntax** (⌃⇧V) uses Douglas Crockford's jslint to check your script for errors and warnings and shows the results in a new window. The *Validate Javascript* window will give you a description and hyperlink when problems are found. The hyperlink will take you straight to the where jslint suspects the problem arises.

* **Validate Syntax Quick** (⌘S) same as above except that instead of a dedicated window you simply get a tooltip showing the number of errors and warnings. This command overrides the Save behavior so every time you save your javascript it will be passed through jslint. Of course it only applies to javascript files so you don't need to worry about accidentally jslint'ing your non-javascript files.

* **Edit Lint Validation settings** allows you to customize what jslint considers when checking your script. The format and meaning of the options are straightforward and well documented within the settings file itself.

Formatting / Compression
---

* **Format Javascript** (⌃Q) attempts to beautify your javascript by inserting uniform line breaks and indentation throughout your current document or selection.

* **Compress (current file)** (⌃⌘C) uses a custom Rhino build from the Dojo Toolkit project to compress your current javascript document. Before compressing it attempts to insert missing semi-colons so you should consider running *Validate Syntax* and fixing missing semi-colons prior to using this command.

* **Dean Edwards Packer (current file)** (⌃⌘C) compresses and obfuscates your current javascript document. It currently relies on the Packr ruby port which is based on version 3 of Packer. According to Dean Edwards, **"All statements, *including function declarations*, must be correctly terminated with semi-colons"** before you run this command. After an email exchange with James Coglan, author of Packr, it's been decided that base62 encoding not be on by default as having it off yields more efficiency when your scripts are gzipped. However, if you would like base62 encoding just open the Packer command in the bundle editor and change, `Packr.pack_file('/tmp/compress_this_file.js', :shrink_vars => true)` to `Packr.pack_file('/tmp/compress_this_file.js', :shrink_vars => true, :base62 => true)`

* **YUI! Compressor (current file)** (⌃⌘C) compresses your current javascript document. By default it assumes your character set is UTF-8. Additionally it strictly preserves semi-colons, i.e. it will not drop or attempt to insert any semi-colons. Both of these settings can be easily changed by opening the Bundle editor and adjusting the second line of this command through the Bundle editor.

* **Minimize (current file)** (⌃⌘C) uses Douglas Crockford's JSMin to minimize your current javascript document. It will not do any semi-colon insertion or removal.

* **Minimize selection** (⌃⌥⇧Q) same as the above except it only applies to the selected portion of your current javascript document.

* **Convert Javascript to Bookmarklet** (⌃⌥⇧Q) turns your current javascript selection or document into a [bookmarklet][bkml] for use in a web browser.

* **Convert Bookmarklet to Javascript** (⌃⌥⇧Q) does the opposite of the above; turns an existing bookmarklet into a standard javascript.


Licenses
---

* **[JSLint][lint]** Copyright 2002 Douglas Crockford
* **[Dojo Toolkit][dojo]** [BSD License][dbsd] or [Academic Free License version 2.1][dafl]
* **[Rhino][rhino]** [MPL 1.1/GPL 2.0][rmpl] [except where noted][radd]
* **[Dean Edwards Packer][pack]** [LGPL License][lgpl]
* **[Packr][packr]** [MIT License][mit]
* **[YUI! Compressor][yuic]** [BSD License][ybsd]
* **[JSMin][jsmin]** Copyright 2001 Douglas Crockford

[rhino]:  http://developer.mozilla.org/en/docs/Rhino_documentation
[rmpl]:   http://www.mozilla.org/MPL/
[radd]:   http://developer.mozilla.org/en/docs/Rhino_License
[dojo]:   http://dojotoolkit.org/docs/shrinksafe
[dbsd]:   http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L13
[dafl]:   http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L43
[pack]:   http://dean.edwards.name/packer/
[packr]:  http://blog.jcoglan.com/packr/
[lint]:   http://www.jslint.com/
[lgpl]:   http://creativecommons.org/licenses/LGPL/2.1/
[mit]:    http://www.opensource.org/licenses/mit-license
[yuic]:   http://developer.yahoo.com/yui/compressor/
[ybsd]:   http://developer.yahoo.com/yui/license.html
[jsmin]:  http://www.crockford.com/javascript/jsmin.html
[bkml]:   http://en.wikipedia.org/wiki/Bookmarklet