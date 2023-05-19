var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static("../programming_3"));

app.get("/", function(req, res){
   res.redirect("index.html")
});

server.listen(3000, function(){
   console.log("Example is running on port 3000");
});

var framRate = 60

xLength = 70;
yLength = 70;

matrix = [];

objects = [];

const Block = require("./Block")
const Grass = require("./Grass")
const GrassEater = require("./GrassEater")
const Predator = require("./Predator")
const Sprayer = require("./Sprayer")
const Sherrif = require("./Sherrif")
const ExplosiveBullet = require("./ExplosiveBullet")
const Fire = require("./Fire")

GlobalMethods = {
   //return the class version of a given id.
  classify : function(number, x, y){
      switch(number){
          case 0:
              return null //an empty tile
          case 1:
              return new Grass(x,y);
          case 2:
              return new GrassEater(x,y);
          case 3:
              return new Predator(x,y);
          case 4:
              return new Sherrif(x,y);
          case 5:
              return new Sprayer(x,y);
          case 98:
              return new Fire(x,y);
      }
   },

   //change an element in the matrix, and update the color on screen. 
   changeMatrix: function(x, y, value, spread){
       matrix[y][x] = value;
       GlobalMethods.drawRect(x,y);
       if(spread == true) objects.push(GlobalMethods.classify(value, x, y));
   },

   //update color of square (rectangle) on the screen.
   drawRect: function(x,y){
       io.emit("drawRect", x, y, matrix)
   }
}

function createCanvas(){
   console.log("A user joined!")
   for (let y = 0; y < yLength; y++) {
         matrix.push([])
         for (let x = 0; x < xLength; x++) {
            let number = Math.random() * 100
            if(number < 5) number = 0; //empty
            else if(number < 90) number = 1; //grass
            else if(number < 97) number = 2; //grassEater
            else if(number < 99) number = 3; //predator
            else if(number < 99.5) number = 4; //sherrif
            else number = 5; //sprayer
            matrix[y].push(number);

            let object = GlobalMethods.classify(number, x, y);
            if(object != null) objects.push(object);
            
         }
   }

   //draw the colors of squares (rectangles) on the screen.
   for (var y = 0; y < matrix.length; y++) {
         for (var x = 0; x < matrix[y].length; x++) {
            GlobalMethods.drawRect(x, y)

            /*
            fill("blue")
            text(x+" "+y, x*side+side/2,y*side+side/2)
            */
         }
   }
   
}

function drawGame(){
   for(let i in objects){
      objects[i].move();
   }

   return matrix

}


setInterval(drawGame, 1000/framRate)
clearInterval()
// var p = document.createElement('p');
//    	p.innerText = "msg";
//     chatDiv = document.getElementById("div")
//    	chatDiv.appendChild(p);

io.on("connection", function(socket){
   matrix = [];
   objects = [];
   createCanvas()
   socket.emit("objectsInfo", objects)
   socket.emit("initial", matrix)
   io.on("disconnect", function(){
      console.log("A user left!")
   })
})