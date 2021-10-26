// let http = require('http');
let fs = require('fs');
let path = require('path')
let express = require('express')


var app = express();
let host = "127.0.0.1"
let port = "8080"

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var x = 0
var y = 0
var siteReloads = 0
app.get('/', function (_, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, './')
    });
    siteReloads++

    function infinityLoop() {
        setTimeout(function () {
            fs.writeFile("json.txt", "{\"x\": " + x + ", \"y\": " + y + "}", function (err) {
                if (err) return console.log(err);
            });

            x++
            y++
            infinityLoop();
        }, 1000)
    }

    if (siteReloads === 1) {
        infinityLoop()
    } else {
        x = 0
        y = 0
    }
})

app.get('/api/json', function (_, res) {
    fs.readFile("json.txt", "utf8", function (err, data) {
        if (err) {
            res.send({ "x": "file", "y": "crash" })
        } else {
            res.send(JSON.parse(data))
        }
    })
})

var server = app.listen(port, function () {
    console.log("NodeJS listening at http://%s:%s", host, port)
})
