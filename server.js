// let http = require('http');
let fs = require('fs');
let path = require('path')
let express = require('express')


var app = express();

var x = 0
var y = 0
var siteReloads = 0
app.get('/', function (req, res) {
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

var server = app.listen(8000, function () {
    var host = "127.0.0.1"
    var port = "8000"
    console.log("NodeJS listening at http://%s:%s", host, port)
})
