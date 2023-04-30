'use strict';

var bodyParser = require('body-parser')
var express = require('express');
var app = express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const shiken_kubuns_api = require('./shiken_kubuns_api.json');


app.get('/health', function (req, res) {
  res.json({ status: "OK" });
});

app.get('/api/shiken_kubuns', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify(shiken_kubuns_api) );
})

var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

