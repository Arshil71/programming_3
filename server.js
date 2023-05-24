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

const Weather = {
   Spring: "Spring",
   Summer: "Summer",
   Fall: "Fall",
   Winter: "Winter"
}

currentWeather = Weather.Spring
currentFrame = 0

var framRate = 10

xLength = 50;
yLength = 50;

matrix = [];

objects = [];


const Block = require("./Block")
const Grass = require("./Grass")
const GrassEater = require("./GrassEater")
const Predator = require("./Predator")
const Sprayer = require("./Sprayer")
const Sherrif = require("./Sherrif")
const ExplosiveBullet = require("./ExplosiveBullet")
const Fire = require("./Fire");

//statistics stuff
grassEaten = 0
grassBurnt = 0
grassEaterEaten = 0

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
   changeMatrix: function(x, y, value, spread, remover = -1){
      //statistics stuff:
      if(matrix[y][x] == 1){
         //if grass has been eaten by predator or grass eater
         if(remover == 2 || remover == 3)
            grassEaten++;
         
         //if grass was burnt by fire
         else if(remover == 98)
            grassBurnt++;
            
      }

      else if(matrix[y][x] == 2){
         //grassEater eaten by predator
         if(remover == 3)
            grassEaterEaten++;
      }

       matrix[y][x] = value;
       if(spread == true && value != 0) objects.push(GlobalMethods.classify(value, x, y));
   },
}

//checks whether or not [x,y] is in the matrix.
function isValid(x,y){
   return x >= 0 && y >= 0 && y < matrix.length && x < matrix[y].length;
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
   io.emit("updateWholeRect", matrix)
   
}

function drawGame(){
   updateWeather()
   for(let i in objects){
      objects[i].move();
   }

   io.emit("updateWholeRect", matrix)

   //statistics, these variables are stored in the server for optimizing the performance, instead of reapeatedly emitting these signals for each object and updating them for the client
   io.emit("grassEaten", grassEaten)
   io.emit("grassBurnt", grassBurnt)
   io.emit("grassEaterEaten", grassEaterEaten)


   return matrix

}

function updateWeather(){
   currentFrame++;
   if(currentFrame == 50){
      currentWeather = Weather.Summer
      io.emit("updateWeather", currentWeather)
   } 
   else if(currentFrame == 100){
      currentFrame = 0
      currentWeather = Weather.Winter
      io.emit("updateWeather", currentWeather)
   }
}


setInterval(drawGame, 1000/framRate)
clearInterval()
// var p = document.createElement('p');
//    	p.innerText = "msg";
//     chatDiv = document.getElementById("div")
//    	chatDiv.appendChild(p);

io.on("connection", function(socket){
   //THIS SERVER WORKS FOR 1 CLIENT ONLY, A NEW USER ENTERING WILL CAUSE EVERYTHING TO RESTART
   grassEaten = 0;
   grassBurnt = 0;
   grassEaterEaten = 0;
   matrix = [];
   objects = [];
   createCanvas()
   socket.emit("initial", matrix)

   socket.on("disconnect", function(){
      console.log("A user left!")
   })

   socket.on("onCheatClicked", function(x, y, radius, toIndex){
      if(!isValid(x,y)) return
      var spread = toIndex > 0

      for(var yy = y - radius; yy <= y + radius; yy++){
         for(var xx = x - radius; xx <= x + radius; xx++){
            if(isValid(xx,yy)){
               if(matrix[yy][xx] != 0){
                  for(var i in objects){
                     if(xx == objects[i].x && yy == objects[i].y){
                        objects.splice(i,1);
                        break; //to break out of the loop, not keep searching for the object.
                     }
                  }
               }
               GlobalMethods.changeMatrix(xx,yy, toIndex, spread);
            }
         }
      }
      io.emit("updateWholeRect", matrix)
      
   })
   
})