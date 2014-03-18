puppet.js
=========

Usage:

    Puppet("/testpage") creates singleton (no cleanup needed)
    new Puppet("/testpage").close() (instances needs to be closed)
    .visit() sets href
    .dispatch("click") dispatches click event
    .click() same as dispatch("click")
    .html() read html of full dome including doctype
    .text("#test") query for single text (1.try jquery, 2. native query, 3. test # . a-z)
    .persist("label") disable cleanup and label iframe
    
Notes:
Custom events in ie without using libraries
Custome assert QUnit.assert
http://coveralls.io

<div id="puppet"></div> 
Puppet IFrame
1. /testpage
2. label - /testpage

	
	
	
