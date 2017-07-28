var express=require('express')
var app = express()
var redis = require('redis'),
    client=redis.createClient()
// var count=0
var bodyParser=require('body-parser')



app.get('/', function (req, res) {
    count++
    client.set('times',count)
    client.get('times', function (err,reply) {
        res.send(reply)
    })
})

var urencodedParser=bodyParser.urlencoded({extended:false})
app.post('/add-anything',urencodedParser,function (req,res) {
    var response = {
        "content":req.body.content
    }
    client.set('content',JSON.stringify(response))
    res.send(JSON.stringify(response))
})

var urencodedParser=bodyParser.urlencoded({extended:false})
app.post('/student',urencodedParser,function (req,res) {
    var response={
        'name':req.body.name,
        'id':req.body.id,
        'class':req.body.class,
        'nation':req.body.nation,
        'chinese':req.body.chinese,
        'english':req.body.english,
        'math':req.body.math,
        'programming':req.body.programming
    }
    if (response.id.length===6){
        client.set(response.id,JSON.stringify(response))
        res.send(JSON.stringify(response))
    }else{
        res.status(400).send('400-请按正确的格式输入(格式：姓名, 学号, 学科: 成绩, …)')
    }

})

app.use(express.static('public'))
app.get('index.html',function (req,res) {
    res.sendFile(__dirname + "/" + "index.html" )
})

app.get('/students', function (req, res) {
    var response={
        'id':req.query.id
    }
    res.send(JSON.stringify(response))
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("访问地址为 http://%s:%s", host, port)
})