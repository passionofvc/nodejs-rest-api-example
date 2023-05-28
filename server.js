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
  const shiken_days = data.map(  (data)=>
      ({"shiken_day" : data.shiken_day , "wareki" : data.shiken_wareki})
  );
  res.writeHead(200, {'Content-Type': 'application/json'});
  //console.log(shiken_days);
  const unique = [...new Set(shiken_days)];
  console.log(unique);
  res.end( JSON.stringify( unique ) );
})

app.get('/api/get_shiken_day_kubuns', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const shiken_day = req.query.shiken_day;

  console.dir(req.query);
  const data = T_SHIKEN_QUESTIONS.filter( (data) =>  (data.shiken_kubun == shiken_kubun && data.shiken_day == shiken_day) );
  const day_kubuns = data.map(  (data)=> data.day_kubun );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify( uniqueArray(day_kubuns) ) );
})

app.get('/api/get_question', function (req, res) {
  const shiken_kubun = req.query.shiken_kubun;
  const shiken_day = req.query.shiken_day;
  const day_kubun = req.query.day_kubun;
  const que_no = req.query.que_no;
  console.dir(req.query);
  const questionInfo = get_one_question(shiken_kubun, shiken_day, day_kubun, que_no);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end( JSON.stringify(questionInfo) );
})


app.get('/api/get_questions', function (req, res) {
    const shiken_kubun = req.query.shiken_kubun;
    const shiken_day = req.query.shiken_day;
    const day_kubun = req.query.day_kubun;
    console.dir(req.query);

    const filterQues = T_SHIKEN_QUESTIONS.filter( (data) =>  (
            data.shiken_kubun == shiken_kubun
            && data.shiken_day == shiken_day
            && data.day_kubun == day_kubun
        )
    );

    const questionInfos = [];
    filterQues.map((e) => questionInfos.push( get_one_question(e.shiken_kubun, e.shiken_day, e.day_kubun, e.que_no) ) );
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end( JSON.stringify(questionInfos) );
})

var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

const uniqueArray = arr =>
    [...new Set(arr.map(o => JSON.stringify(o)))]
        .map( s => JSON.parse(s) );

function get_one_question(
     shiken_kubun,
     shiken_day ,
     day_kubun ,
     que_no) {

    const filterQue = T_SHIKEN_QUESTIONS.filter( (data) =>  (
            data.shiken_kubun == shiken_kubun
            && data.shiken_day == shiken_day
            && data.day_kubun == day_kubun
            && data.que_no == que_no
        )
    )[0];

    const questionInfo = {...filterQue, question :[],  answers:[] };
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
    answer.map( (e) => {
          const is_correct_ans = questionInfo.correct_ans_no === e.ans_no;
          questionInfo.answers.push({"ans_no": e.ans_no, "ans_attr": e.ans_attr, "ans_contents": e.ans_contents, "is_correct_ans" : is_correct_ans});
        }
    );
    return questionInfo;
}