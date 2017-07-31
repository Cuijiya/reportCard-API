var express=require('express')
var app = express()
var redis = require('redis'),
    client=redis.createClient()
var bodyParser=require('body-parser')


// // //第一阶段:
// // app.get('/',function (req,res) {
// //     res.send('hello world')
// // })
//
//
// // //第二阶段：计数
// var count=0
// app.get('/', function (req, res) {
//     count++
//     client.set('times',count)
//     client.get('times', function (err,reply) {
//         res.send(reply)
//     })
// })

// //第三阶段：接收返回数据
// app.post('/add-anything',urencodedParser,function (req,res) {
//     client.set('content',JSON.stringify(req.body))
//     res.send(JSON.stringify(req.body))
// })

//第四阶段
var urencodedParser=bodyParser.urlencoded({extended:true})
app.post('/student',urencodedParser,function (req,res) {
    if (req.body.id.length===6){
        client.set(req.body.id,JSON.stringify(req.body))
        res.send(JSON.stringify(req.body))
    }else{
        res.status(400).send('请按正确的格式输入(格式：姓名, 学号, 学科: 成绩, …)')
    }
})

//第五阶段
app.use(express.static('public'))

//静态文件托管
//res.sendFile()

app.get('/',function (req,res) {
    res.sendFile( student-score-sheet-api-version+ '/'+'newWeb.html' )
})

app.get('/students', function (req, res) {
    var studentId=req.query.id.split(',')
    var flag
    var arr=[],index=0
    for (var i of studentId) {
        if (i.length!==6) {
            res.status(400).send('请按正确的格式输入要打印的学生的学号（格式： 学号, 学号,…）')
            flag=false
            break
        }else if (client.get(i)===null) {
            res.send('学号为'+i+'的学生不存在')
        }else if (client.get(i)!==null) {
            arr[index]=JSON.parse(client.get(i))
            index++
        }
    }
    var ave=getAve(arr)
    var score=getScore(arr)
    var classAverage=getClassAverage(ave)
    var median=getMedian(score)
    print(arr, ave, score, classAverage, median)
})

function getAve(arr) {
        var ave = [], sco = 0;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 1; j < arr[i].length; j++) {
                sco += arr[i][j] * 1;
            }
            sco = sco / 4;
            ave.push(sco);
        }
        return ave;
    }

    function getScore(arr) {
        var score = [], sco = 0;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 1; j < arr[i].length; j++) {
                sco += arr[i][j] * 1
            }
            score.push(sco)
        }
        return score
    }

    function getClassAverage(ave) {
        var classAverage = 0;
        for (var i = 0; i < ave.length; i++) {
            classAverage += ave[i]
        }
        classAverage = (classAverage / ave.length).toFixed(1)
        return classAverage
    }

    function getMedian(score) {
        var median
        var newScore = score.sort(function (x, y) {
            return x - y;
        });
        if (newScore.length % 2 === 0) {
            median = (newScore[newScore.length / 2 - 1] + newScore[newScore.length / 2]) / 2;
        }
        else {
            median = newScore[Math.floor(newScore.length / 2)];
        }
        return median
    }

    function print(arr, ave, score, classAverage, median) {
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
            newArr[i] = []
            newArr[i].push(arr[i][0]);
            newArr[i].push(arr[i][3]);
            newArr[i].push(arr[i][1]);
            newArr[i].push(arr[i][2]);
            newArr[i].push(arr[i][4]);
            newArr[i].push(ave[i]);
            newArr[i].push(score[i]);
        }
        var str = ''
        for (i = 0; i < newArr.length; i++) {
            for (var j = 0; j < newArr[i].length; j++) {
                str += newArr[i][j] + '|'
            }
            str += '\n'
        }
        console.log('成绩单\n姓名|语文|英语|数学|编程|平均分|总分|\n========================')
        console.log(str);
        console.log('========================\n全班总平均分: ' + classAverage + '\n全班中位数: ' + median)
    }



//第六阶段
app.put('/students/:id', urencodedParser,function (req, res) {
    if (client.get(req.body.id)===null) {
        res.status(404).send('该学生不存在')
    }else {
        client.set(req.body.id,req.body)
        res.send(JSON.stringify(req.body))
    }
})

//第七阶段
app.delete('/students/:id'),urencodedParser, function (req,res) {
    if (client.get(req.body)!==null) {
        client.remove(req.body)
        res.send('该学生已成功删除')
    }else{
            res.status(404).send('该学生不存在')
    }

}




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("访问地址为 http://%s:%s", host, port)
})
