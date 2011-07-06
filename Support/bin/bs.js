/*
---
provides    : BuildSugar
version     : 0.1alpha1
description : Provides a bizarrely clean & simple syntax sugar for building HTML/XML strings
source      : http://gist.github.com/278016
git         : git://gist.github.com/278016.git
demo        : http://jsfiddle.net/SubtleGradient/4W3RR/

author      : Thomas Aylott
site        : subtlegradient.com
copyright   : 2010 Thomas Aylott
license     : MIT
...
*/
var BS = (function (bs) {
	
	function BS ( selector,content ) {
		bs .push ([])
		return BS2 ( selector,content )
	}
	
	function BS2 ( selector,content ) {
		content = ''+ ( content||'' )
		
		selector && write ( '<',selector,'>' )
		content  && write ( content )
		selector && write ( '</',selector .split (' ')[0],'>' )
		
		return BS2
	}
	
	BS2 .toString = function () { return bs .pop () .join ('') }
	
	function write () { bs[bs.length-1] .push (bs .join .call ( arguments,'' )) }
	
	return BS
	
}) ([])

if (typeof exports == 'object') exports.BS = BS
