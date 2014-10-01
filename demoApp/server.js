var express   = require('express');
var path      = require('path');
var reloader  = require('connect-livereload');

module.exports.run = function(){

var app = express();

app.use( reloader() );
app.use( express.static( path.join( './', 'bower_components')));
app.use( express.static( path.join( './', 'src') ) );
app.use( express.static( path.join( './', 'demoApp' ) ) );


app.listen( 9000, '127.0.0.1', function(){
  console.log('Server Listening on 9000');
  console.log('Serving demo/index.html');

  console.log('Serving localhost:9000/dist as /');
  console.log('Serving localhost:9000/src as /');
});

  return module.exports.app = app;
};