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
    }

    checkEndRoad() {
        console.log(this.road)
        var r = roads[this.road]
        if(r.orient == 1) {
            if(this.orient == 1){
                if(this.y + car_width >= (r.y + r.length) * line_width) {
                    return true;
                }
            } else if(this.orient == 2) {
                if(this.y <= r.y * line_width){
                    return true;
                }
            }
        }
        if(r.orient == 2) {
            if(this.orient == 1){
                if(this.x + car_width >= (r.x + r.length) * line_width){
                    return true;
                }
            }else if(this.orient == 2){
                if(this.x <= r.x * line_width){
                    return true;
                }
            }
        }
        return false;
    }
    
    move() {
        this.x += this.vx
        this.y += this.vy
        if(this.checkEndRoad()) {
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
            } while (crossroads[this.croad].dir[dir] == false)
            console.log("нашел"+dir+", следующая дорога: " + crossroads[this.croad].dir[dir])
            this.road = crossroads[this.croad].dir[dir];
            this.moveToStartLoc(crossroads[this.croad], roads[this.road])
        }
    }

    

    moveToStartLoc(croad, road) {
        if(croad.dir["up"] == road.id) {
            this.vx = 0;
            this.vy = -car_speed;
            this.x = (croad.x + 3 * CR_SIZE / 4) * line_width - car_width / 2;
            this.y = croad.y * line_width;
            this.orient = 2;
        }
        if(croad.dir["down"] == road.id) {
            this.vx = 0;
            this.vy = car_speed;
            this.x = (croad.x + CR_SIZE / 4) * line_width - car_width / 2;
            this.y = (croad.y + CR_SIZE) * line_width - car_width;  
            this.orient = 1;
        }
        if(croad.dir["left"] == road.id) {
            this.vx = -car_speed;
            this.vy = 0;
            this.x = croad.x * line_width;
            this.y = (croad.y + CR_SIZE / 4) * line_width - car_width / 2;
            this.orient = 2;
        }
        if(croad.dir["right"] == road.id) {
            this.vx = car_speed;
            this.vy = 0;
            this.x = (croad.x + CR_SIZE) * line_width - car_width;
            this.y = (croad.y + 3 * CR_SIZE / 4) * line_width - car_width / 2;
            this.orient = 1;
        }

    }

    genDir(){
        var dir = Math.floor(Math.random() * 4);
        if(dir == 0){
            return "up";
        } else if (dir == 1){
            return "right";
        } else if (dir == 2){
            return "down";
        } else if (dir == 3){
            return "left"
        }
    }

    draw() {
        drawCar(this.x, this.y)
    }

    spawn() {
        var crx = crossroads[0].x * line_width
        var cry = crossroads[0].y * line_width
        this.x = crx - car_width
        this.y = cry + 3 * line_width / 2 - car_width / 2
        this.road = 0;
        this.orient = 1;
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
        drawRoad(this.x, this.y, this.length, this.width, this.orient)
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
        this.dir = {"up": false, "down": false, "left": false, "right": false}
    }
    

    draw() {
        drawCrossroad(this.x, this.y, this.dir)
    }



    // static toJSON() {
    //     return {"x": this.x, "y": this.y}
    // }
}

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
//-----------------------------

function movement() {
    for (var i = 0; i < cars.length; i++) {
        cars[i].move()
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
                crossroads[r.start].dir["down"] = r.id;
                crossroads[r.end].dir["up"] = r.id;
                y = crossroads[r.start].y + CR_SIZE;
            }
            else{
                crossroads[r.start].dir["up"] = r.id;
                crossroads[r.end].dir["down"] = r.id;
                y = crossroads[r.end].y + CR_SIZE;
            }
            width = CR_SIZE;
            length = Math.abs(crossroads[r.start].y - crossroads[r.end].y) - CR_SIZE;
        }
        else{
            orient = 2;
            y = crossroads[r.start].y
            if(crossroads[r.start].x < crossroads[r.end].x){
                crossroads[r.start].dir["right"] = r.id;
                crossroads[r.end].dir["left"] = r.id;
                x = crossroads[r.start].x + CR_SIZE; 
            }
            else{
                crossroads[r.start].dir["left"] = r.id;
                crossroads[r.end].dir["right"] = r.id;
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
}

function repeat() {
    time += deltaT
    movement()
}



function spawn() {
    cars[0].spawn()
    cars[0].vx = car_speed
    moveInterval = setInterval(repeat, 5)
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
