//import drawMap from './modules/map-generation/mapGenerator.js';
// import mapMain from './modules/map/map.js';

var canvas = document.getElementById('canvas-area');
var ctx = canvas.getContext('2d');

// // var file = fetch("../config.json").then(response => response.text()).then(text => text)

// var json = JSON.parse(data);

// console.log(json);

// var cars_amount = 0;
// var cars = [];
// var roads = [];
// var crossroads = [];

var line_width = 30;
var car_width = 15;
var car_length = 10;

function getMap() {
    crossroads = json["crossroad_param"];
    roads = json["roads_param"];
    cars = json["cars_param"];
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoads();
    drawCrossroads();
    drawCars();
    drawParam();
}

function drawParam() {
    ctx.beginPath();
    ctx.font = "48px serif";
    ctx.fillText("Car 1 speed: " + Math.sqrt(cars[0].vx * cars[0].vx + cars[0].vy * cars[0].vy), 700, 50);
    ctx.fillText("Time: " + Math.floor(Math.floor(time/1000)/60) +":"+Math.floor(time/1000)%60+ "." + time%1000, 700, 100)
    ctx.closePath();

    // for(var i = 0; i < roads.length; i++){
    //     ctx.beginPath();
    //     ctx.font = "48px serif";
    //     ctx.fillText(i, roads[i].x * line_width, roads[i].y * line_width);
    //     ctx.closePath();
    // }
}

function drawCar(x, y, state, angle, rx, ry, dir) {
    ctx.save()
    ctx.fillStyle = "red";
    ctx.arc(rx,ry,3,0,2*Math.PI)
    ctx.fill()
    if(state == 1){
        ctx.translate(rx, ry)
        ctx.rotate(-angle)
        console.log(-angle / Math.PI * 180)
        ctx.fillRect(x - rx, y - ry, car_width, car_length);
    }
    else{
        ctx.fillRect(x, y, car_width, car_length);
    }
    ctx.restore()
}

function drawCrossroad(x, y, dir) {
    var x1 = x * line_width, y1 = y * line_width
    var x2 = x * line_width + line_width * 2, y2 = y * line_width
    var x3 = x * line_width, y3 = y * line_width + line_width * 2
    var x4 = x * line_width + line_width * 2, y4 = y * line_width + line_width * 2
    ctx.fillStyle = "black";
    ctx.fillRect(x * line_width, y * line_width, line_width * 2, line_width * 2);
    // ctx.strokeStyle = "green";
    // if(dir["up"]){
    //     //ctx.lineWidth = 15;
    //     ctx.moveTo(x1, y1)
    //     ctx.lineTo(x2, y2);
    //     ctx.stroke();
    // }
}

function drawRoad(x, y, length, width, orient) {
    ctx.fillStyle = "gray";
    if(orient == 2){
        ctx.fillRect(x * line_width, y * line_width, length * line_width, width * line_width);
    }
    else if(orient == 1) {
        ctx.fillRect((x - 2) * line_width, y * line_width, width * line_width, length * line_width);
    }


}

function drawCars() {
    for(var i = 0; i < cars.length; i++) {
        cars[i].draw()
    }
}

function drawCrossroads() {
    for(var i = 0; i < crossroads.length; i++) {
        // drawCrossroad(crossroads[i].x, crossroads[i].y)
        crossroads[i].draw()
    }

}

function drawRoads() {
    for(var i = 0; i < roads.length; i++){
        //drawRoad(roads[i].crossroad_start - 1, roads[i].crossroad_finish - 1)
        roads[i].draw()
    }
}

function mapMain() {
    //getMap();
    draw();
}

//mapMain()
var drawInterval = setInterval(mapMain, 10)
// mapMain();
// drawMap();

