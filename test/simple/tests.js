test( "hello test", function() {
  Puppet("./simple/test.html");

	equal( Puppet.active.length, 1 , "Passed!" );
});