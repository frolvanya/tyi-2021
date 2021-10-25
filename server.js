// let http = require('http');
let fs = require('fs');
let path = require('path')
let express = require('express')


var app = express();

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
            fs.writeFile("json.txt", "coordinates = '{\"x\": " + x + ", \"y\": " + y + "}'", function (err) {
                if (err) return console.log(err);
                console.log("[*] json.txt was edited");
            });

            x++
            y++
            infinityLoop();
        }, 2000)
    }

    if (siteReloads === 1) {
        infinityLoop()
    } else {
        x = 0
        y = 0
    }
})

app.get('/api/json', function (_, res) {
    fs.readFile("json.txt", "utf8", function (_, data) {
        res.send(JSON.parse(data.split(" = ")[1].substr(1, data.split(" = ")[1].length - 2)))
    })
})

app.post('/post', function (req, res) {
    console.log("Connected to React");
    res.redirect("/")
})

let host = "127.0.0.1"
let port = "8080"

var server = app.listen(port, function () {
    console.log("NodeJS listening at http://%s:%s", host, port)
})
