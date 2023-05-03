'use strict';

var bodyParser = require('body-parser')
var express = require('express');
var app = express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const M_SHIKEN = require('./M_SHIKEN.json');
const T_SHIKEN_QUESTIONS = require('./T_SHIKEN_QUESTIONS.json');
const T_QUESTION_DETAIL = require('./T_QUESTION_DETAIL.json');
const T_ANSWER_DETAIL = require('./T_ANSWER_DETAIL.json');

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

app.get('/api/get_shiken_kubuns', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  const shiken_kubuns = M_SHIKEN.map( (data)=> data.shiken_kubun );
  res.end( JSON.stringify(shiken_kubuns) );
})

app.get('/api/get_shiken_days', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const data = T_SHIKEN_QUESTIONS.filter( data =>  data.shiken_kubun == shiken_kubun );
  const shiken_wareki = data.map(  (data)=> data.shiken_wareki );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify( uniq(shiken_wareki) ) );
})

app.get('/api/get_shiken_day_kubuns', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const shiken_day = req.query.shiken_day;

  console.dir(req.query);
  const data = T_SHIKEN_QUESTIONS.filter( (data) =>  (data.shiken_kubun == shiken_kubun && data.shiken_day == shiken_day) );
  const day_kubuns = data.map(  (data)=> data.day_kubun );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify( uniq(day_kubuns) ) );
})

app.get('/api/get_one_question', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const shiken_day = req.query.shiken_day;
  const day_kubun = req.query.day_kubun;
  const que_no = req.query.que_no;
  console.dir(req.query);
  const filterQue = T_SHIKEN_QUESTIONS.filter( (data) =>  (
         data.shiken_kubun == shiken_kubun
      && data.shiken_day == shiken_day
      && data.day_kubun == day_kubun
      && data.que_no == que_no
      )
  )[0];

  const questionInfo = {...filterQue, question :[],  answer:[] };
  const question = T_QUESTION_DETAIL.filter( (data) =>  (
          data.shiken_kubun == shiken_kubun
          && data.shiken_day == shiken_day
          && data.day_kubun == day_kubun
          && data.que_no == que_no
      )
  );
  question.map( (e) =>
      questionInfo.question.push({ "que_line_no": e.que_line_no , "que_line_attr" : e.que_line_attr, "que_line_contents":  e.que_line_contents}));

  const answer = T_ANSWER_DETAIL.filter( (data) =>  (
          data.shiken_kubun == shiken_kubun
          && data.shiken_day == shiken_day
          && data.day_kubun == day_kubun
          && data.que_no == que_no
      )
  );
  console.log(answer);
  answer.map( (e) => questionInfo.answer.push({ "ans_no" : e.ans_no , "ans_attr" : e.ans_attr, "ans_contents" : e.ans_contents}) );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify(questionInfo) );
})


var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

function uniq(array) {
  return array.filter((elem, index, self) => self.indexOf(elem) === index);
}
