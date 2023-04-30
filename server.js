'use strict';

var bodyParser = require('body-parser')
var express = require('express');
var app = express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const shiken_kubuns_api = require('./shiken_kubuns_api.json');
const shiken_days_api = require('./shiken_days_api.json');

app.set("port", process.env.PORT || 5000);

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain);


app.get('/health', function (req, res) {
  res.json({ status: "OK" });
});

app.get('/api/shiken_kubuns', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  const kubuns = shiken_kubuns_api.map( (data)=> data.shiken_kubun );
  res.end( JSON.stringify(kubuns) );
})

app.get('/api/shiken_days', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const data = shiken_days_api.filter( data =>  data.shiken_kubun == shiken_kubun );
  const shiken_days = data.map(  (data)=> data.shiken_day );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify( uniq(shiken_days) ) );
})

app.get('/api/day_kubuns', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const shiken_day = req.query.shiken_day;

  console.dir(req.query);
  //console.dir(shiken_days_api);
  const data = shiken_days_api.filter( (data) =>  (data.shiken_kubun == shiken_kubun && data.shiken_day == shiken_day) );
  console.log(data);
  const day_kubuns = data.map(  (data)=> data.day_kubun );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify( uniq(day_kubuns) ) );
})


var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

function uniq(array) {
  return array.filter((elem, index, self) => self.indexOf(elem) === index);
}
