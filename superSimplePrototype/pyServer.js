//-----------------------------
var deltaT = 10
var roads = []
var crossroads = []
var cars = []
var cars_amount;
var data = JSON.parse(dataa)
var time = 0
var CR_SIZE = 2
var car_speed = 1
var cars_amount = 0;

var line_width = 30;
var car_width = 15;
var car_length = 10;

var roadLineLength = 20;
//-----------------------------

class Car {
    constructor(x = 0, y = 0){
        this.vx = 0
        this.vy = 0
        this.ax = 0
        this.ay = 0
        this.x = x
        this.y = y
        this.road = 0;
        this.croad = 0;
        this.orient = 1;//1 – по направлению оси, 2 - против направления оси
        this.maxSpeed = 100;
        this.accSpeed = 0.05;
        this.decSpeed = 0.02;
        this.state = 0;//0 - движение вперед, 1 - поворот
        this.dir = 0;
        this.angle = 0;
        this.rx = 0;
        this.ry = 0;
        this.privA = 0;
        this.carWidth = 10;
        this.carLength = 15;
    }

    checkEndRoad(x, y) {
        x = +x.toFixed(1)
        y = +y.toFixed(1)
        var r = roads[this.road]
        if(r.orient == 1) {
            if(this.orient == 1){
                if(y + this.carWidth >= (r.y + r.length) * line_width) {
                    return true;
                }
            } else if(this.orient == 2) {
                if(y <= r.y * line_width){
                    return true;
                }
            }
        }
        if(r.orient == 2) {
            if(this.orient == 1){
                if(x + this.carWidth >= (r.x + r.length) * line_width){
                    return true;
                }
            }else if(this.orient == 2){
                if(x <= r.x * line_width){
                    return true;
                }
            }
        }
        return false;
    }
    
    move() {
        if(this.state == 0) {
            this.moveForvard();
        }
        else if (this.state == 1) {
            this.rotate();
        }
    }

    moveForvard() {
        this.x += this.vx
        this.y += this.vy
        if(this.finishingRoad()) {
            this.vx += this.ax;
            this.vy += this.ay;
            this.vx = +this.vx.toFixed(5)
            this.vy = +this.vy.toFixed(5)
        }
        else if(this.calcSpeed() < this.maxSpeed){
            this.vx -= this.ax
            this.vy -= this.ay
            this.vx = +this.vx.toFixed(5)
            this.vy = +this.vy.toFixed(5)
        }
        if(this.checkEndRoad(this.x, this.y) === true) {
            console.log("Приехали")
            if(this.orient == 1){
                this.croad = roads[this.road].end - 1
            }else if(this.orient == 2){
                this.croad = roads[this.road].start - 1
            }
            var dir;
            do {
                dir = this.genDir();
                console.log("ищу напрвление")
            } while (crossroads[this.croad].dir.get(dir) === undefined)
            console.log("нашел"+dir/(Math.PI)*180+", следующая дорога: " + crossroads[this.croad].dir.get(dir));
            this.road = crossroads[this.croad].dir.get(dir);
            this.dir = dir;
            this.privA = this.angle;
            this.state = 1;
            this.chooseRotatePoint();
            
        }
    }

    chooseRotatePoint() {
        var dang = (this.angle - this.dir * 180 / Math.PI + 360) % 360
        if(dang == 90){
            var a1 = 135;
            var da = (this.angle + 90) % 360;
            this.rx = Math.round(crossroads[this.croad].x * line_width + line_width - line_width * Math.cos((a1+da) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            this.ry = Math.round(crossroads[this.croad].y * line_width + line_width + line_width * Math.sin((a1+da) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            console.log(crossroads[this.croad].x * line_width, crossroads[this.croad].y* line_width, this.rx, this.ry)
        }
        else if (dang == 270) {
            var a1 = 135;
            var da = this.angle;
            this.rx = Math.round(crossroads[this.croad].x * line_width + line_width - line_width * Math.cos((a1+da) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            this.ry = Math.round(crossroads[this.croad].y * line_width + line_width + line_width * Math.sin((a1+da) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            console.log(crossroads[this.croad].x * line_width, crossroads[this.croad].y* line_width, this.rx, this.ry)
        }
        else if (dang == 180) {
            var a1 = 135;
            var da1 = (this.angle + 90) % 360;
            var da2 = this.angle;
            var rx1 = Math.round(crossroads[this.croad].x * line_width + line_width - line_width * Math.cos((a1+da1) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            var ry1 = Math.round(crossroads[this.croad].y * line_width + line_width + line_width * Math.sin((a1+da1) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            var rx2 = Math.round(crossroads[this.croad].x * line_width + line_width - line_width * Math.cos((a1+da2) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));
            var ry2 = Math.round(crossroads[this.croad].y * line_width + line_width + line_width * Math.sin((a1+da2) * Math.PI / 180) / Math.cos(a1 * Math.PI / 180));

            this.rx = (rx1 + rx2) / 2
            this.ry = (ry1 + ry2) / 2
        }
    }

    rotate() {
        if(this.angle * Math.PI / 180 - this.dir == 0){
            this.state = 0;
        }
        else {
            var dang = (this.angle - this.dir * 180 / Math.PI + 360) % 360
            if(dang > 0 && dang <= 90){
                this.angle = (this.angle + 359) % 360;
            }
            else {
                this.angle = (this.angle + 1) % 360;
            }
            if(this.angle * Math.PI / 180 == this.dir) {
                this.moveToStartLoc(crossroads[this.croad], roads[this.road]);
                this.state = 0;
                
                if(Math.abs(this.dir/Math.PI*180 - this.privA) % 180 == 90){
                    [this.carWidth, this.carLength] = [this.carLength, this.carWidth];
                }
            }
        }
    }

    calcSpeed() {
        return Math.hypot(this.vx, this.vy);
    }
    finishingRoad() {
        var speed = Math.hypot(this.vx, this.vy)
        var finishTime = speed / this.decSpeed;
        var x = this.x + this.vx * finishTime + this.ax * finishTime * finishTime / 2;
        var y = this.y + this.vy * finishTime + this.ay * finishTime * finishTime / 2;
        //console.log(x, y);
        if(this.checkEndRoad(x, y)) {
            return true;
        }
        return false;
    }

    moveToStartLoc(croad, road) {
        if(croad.dir.get(Math.PI/2) == road.id) {
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = this.decSpeed;
            this.x = (croad.x + 3 * CR_SIZE / 4) * line_width - this.carWidth / 2;
            this.y = croad.y * line_width;
            this.orient = 2;
        }
        if(croad.dir.get(3*Math.PI/2) == road.id) {
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = -this.decSpeed;
            this.x = (croad.x + CR_SIZE / 4) * line_width - this.carWidth / 2;
            this.y = (croad.y + CR_SIZE) * line_width - this.carWidth;  
            this.orient = 1;
        }
        if(croad.dir.get(Math.PI) == road.id) {
            this.vx = 0;
            this.vy = 0;
            this.ax = this.decSpeed;
            this.ay = 0;
            this.x = croad.x * line_width;
            this.y = (croad.y + CR_SIZE / 4) * line_width - this.carWidth / 2;
            this.orient = 2;
        }
        if(croad.dir.get(0) == road.id) {
            this.vx = 0;
            this.vy = 0;
            this.ax = -this.decSpeed;
            this.ay = 0;
            this.x = (croad.x + CR_SIZE) * line_width - this.carWidth;
            this.y = (croad.y + 3 * CR_SIZE / 4) * line_width - this.carWidth / 2;
            this.orient = 1;
        }

    }
    
    genDir(){
        var dir = Math.floor(Math.random() * 4);
        return dir * Math.PI / 2;
    }

    draw() {
        drawCar(this.x, this.y, this.state, (this.angle-this.privA) * Math.PI / 180, this.rx, this.ry, this.carWidth, this.carLength)
    }

    spawn() {
        var crx = crossroads[0].x * line_width
        var cry = crossroads[0].y * line_width
        this.x = crx - this.carWidth
        this.y = cry + 3 * line_width / 2 - this.carWidth / 2
        this.road = 0;
        this.orient = 1;
        this.ax = -this.decSpeed;
        this.ay = 0;
    }
    // static toJSON() {
    //     return {"x": this.x, "y": this.y}
    // }
}

class Road {
    constructor(crossroadStartNum, crossroadEndNum, id, laneAmount = 1, level = 1,){
        this.start = crossroadStartNum
        this.end = crossroadEndNum
        this.laneAmount = laneAmount
        this.level = level
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.length = 0;
        this.orient = 0;//1 - вертикальная, 2 - горизонтальная 
        this.id = id;
    }

    draw() {
        drawRoad(this.x, this.y, this.length, this.width, this.orient, this.start - 1)
    }

    // static toJSON(self){
    //     return {"crossroad_start": self.start, "crossroad_finish": self.end, "lane_num": self.laneAmount, "level": self.level}
    // }
}

class Crossroad {
    // x;
    // y;
    constructor(x, y){
        this.x = x
        this.y = y
        this.dir = new Map();
        this.light = 0;
        //this.time = 0;
        this.interval = 2000;
    }
    
    change() {
        if(time % this.interval == 0) {
            this.light = (this.light + 1) % 2;
        }
    }


    draw() {
        drawCrossroad(this.x, this.y, this.light)
    }




    // static toJSON() {
    //     return {"x": this.x, "y": this.y}
    // }
}



function movement() {
    for (var i = 0; i < cars.length; i++) {
        cars[i].move()
    }
    for (var i = 0; i < crossroads.length; i++) {
        crossroads[i].change();
    }
}

function initMap(data) {

    for (var crossroad of data["crossroad_param"]){
        //console.log(crossroad)
        crossroads.push(new Crossroad(crossroad["x"], crossroad["y"]))
    }
    for (var road of data["roads_param"]){
        roads.push(new Road(road["crossroad_start"], road["crossroad_finish"], road["id"]))
    }
    for (var car of data["cars_param"]) {
        cars.push(new Car(car["x"], car["y"]))
    }
    for(var i = 0; i < roads.length; i++) {
        var r = roads[i];
        r.start--;
        r.end--;
        var length, width, orient, x , y; 
        if(crossroads[r.start].x == crossroads[r.end].x) {
            orient = 1;
            x = crossroads[r.start].x + CR_SIZE;
            if(crossroads[r.start].y < crossroads[r.end].y){
                crossroads[r.start].dir.set(3*Math.PI/2, r.id);
                crossroads[r.end].dir.set(Math.PI/2, r.id);
                y = crossroads[r.start].y + CR_SIZE;
            }
            else{
                crossroads[r.start].dir.set(Math.PI/2, r.id);
                crossroads[r.end].dir.set(3*Math.PI/2, r.id);
                y = crossroads[r.end].y + CR_SIZE;
            }
            width = CR_SIZE;
            length = Math.abs(crossroads[r.start].y - crossroads[r.end].y) - CR_SIZE;
        }
        else{
            orient = 2;
            y = crossroads[r.start].y
            if(crossroads[r.start].x < crossroads[r.end].x){
                crossroads[r.start].dir.set(0 ,r.id);
                crossroads[r.end].dir.set(Math.PI, r.id);
                x = crossroads[r.start].x + CR_SIZE; 
            }
            else{
                crossroads[r.start].dir.set(Math.PI, r.id);
                crossroads[r.end].dir.set(0, r.id);
                x = crossroads[r.end].x + CR_SIZE;
            }
            width = CR_SIZE
            length = Math.abs(crossroads[r.start].x - crossroads[r.end].x) - CR_SIZE;
        }
        roads[i].x = x;
        roads[i].y = y;
        roads[i].width = width;
        roads[i].length = length;
        roads[i].orient = orient;
        r.start++;
        r.end++;
    }

   
}

main()

function main() {
    initMap(data)
    moveInterval = setInterval(repeat, deltaT)
}

function repeat() {
    time += deltaT
    movement()
}



function spawn() {
    cars[cars_amount] = new Car()
    cars[cars_amount].spawn()
    cars[cars_amount].vx = car_speed
    cars_amount++;
    
}

function stop() {
    clearInterval(moveInterval)
}


// Project structure
// Crossroad: (x, y)
// Crossroads: [Crossroad, Crossroad, ...]

// Length: double,
// Level: 0 (base),

// Road: (CrossroadStartNum, CrossroadEndNum, LaneAmount, Length, Level)
// Roads: [Road, Road, ...]


// Car: (x_center, y_center, width, length, velocity, a, angle)
// Cars: [Car, Car, ...]
// CarFunctions: {
//     StraightMove,
//     Rotation,
//     StopBeforeTrifficLights
// }
