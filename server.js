var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static("../programming_3"));

app.get("/", function(req, res){
   res.redirect("index.html")
});

app.listen(3000, function(){
   console.log("Example is running on port 3000");
});

const Grass = require("./Grass")
const GrassEater = require("./GrassEater")
const Predator = require("./Predator")
const Sprayer = require("./Sprayer")
const Sherrif = require("./Sherrif")
const ExplosiveBullet = require("./ExplosiveBullet")
const Fire = require("./Fire")

var xLength = 70;
var yLength = 70;

matrix = [];

objects = [];

function createCanvas(){
   function setup() {
      for (let y = 0; y < yLength; y++) {
          matrix.push([])
          for (let x = 0; x < xLength; x++) {
              let number = random(100)
              if(number < 5) number = 0; //empty
              else if(number < 90) number = 1; //grass
              else if(number < 97) number = 2; //grassEater
              else if(number < 99) number = 3; //predator
              else if(number < 99.5) number = 4; //sherrif
              else number = 5; //sprayer
              matrix[y].push(number);
   
              let object = classify(number, x, y);
              if(object != null) objects.push(object);
              
          }
      }
   
      //draw the colors of squares (rectangles) on the screen.
      for (var y = 0; y < matrix.length; y++) {
          for (var x = 0; x < matrix[y].length; x++) {
   
              drawRect(x, y)
   
              /*
              fill("blue")
              text(x+" "+y, x*side+side/2,y*side+side/2)
              */
          }
      }
   }
}

function drawGame(){
   for(let i in objects){
      objects[i].move();
   }

   return matrix

}

createCanvas()

setInterval(drawGame, 1000)
clearInterval()

io.on("connection", function(socket){
   socket.emit("objectsInfor", objects)
   socket.emit("initial", matrix)
})