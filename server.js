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

//ADD AN FPS BAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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

//statistics stuff, make sure to also add these in io.on(connection)
grassEaten = 0
grassBurnt = 0
grassEaterEaten = 0
tilesExploded = 0
grassSprayed = 0;
currentNumberOfGrass = 0;

GlobalMethods = {
   //return the class version of a given id.
  classify : function(number, x, y){
      switch(number){
          case 0:
              return null //an empty tile
          case 1:
            currentNumberOfGrass++;
              return new Grass(x,y);
          case 2:
             var genderChooser = Math.random();
             if(genderChooser < 0.4) return new GrassEater(x,y, "male") //40% chance of male
             else return new GrassEater(x,y, "female"); //60% chance of female
              
          case 3:
            var genderChooser = Math.random();
            if(genderChooser < 0.4) return new Predator(x,y, "male") //40% chance of male
            else return new Predator(x,y, "female"); //60% chance of female
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

   deleteObject: function(x,y){
      for(var i in objects){
         if(x == objects[i].x && y == objects[i].y){
            if(objects[i].id == 1) currentNumberOfGrass--;
            objects.splice(i,1);
            break; //to break out of the loop, not keep searching for the object.
         }
      }
   }
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
   io.emit("statistics", [grassEaten,grassBurnt,grassEaterEaten,tilesExploded,grassSprayed,currentNumberOfGrass])

   return matrix

}

function updateWeather(){
   currentFrame += 1;
   if(currentFrame == 0){
      currentWeather = Weather.Spring
      io.emit("updateWeather", currentWeather)
      updateObjectsWeather()
   } 
   else if(currentFrame == 50){
      currentWeather = Weather.Summer
      io.emit("updateWeather", currentWeather)
      updateObjectsWeather()
   }
   else if(currentFrame == 100){
      currentWeather = Weather.Fall
      io.emit("updateWeather", currentWeather)
      updateObjectsWeather()
   }
   else if(currentFrame == 150){
      currentFrame = -50
      currentWeather = Weather.Winter
      io.emit("updateWeather", currentWeather)
      updateObjectsWeather()
   }
}

function updateObjectsWeather(){
   saveStatistics()
   for(var i in objects){
      objects[i].weatherChanged(currentWeather)
   }
}

function saveStatistics(){
   let statistics ={
      "grassEaten" : grassEaten,
      "grassBurnt" : grassBurnt,
      "grassEaterEaten" : grassEaterEaten,
      "tilesExploded" : tilesExploded,
      "grassSprayed" : grassSprayed,
      "currentNumberOfGrass" : currentNumberOfGrass
   }

   var stringifiedStats = JSON.stringify(statistics);

   var fs = require('fs');
   fs.writeFile("statistics.json", stringifiedStats, function(err, result) {
      if(err) console.log('error', err);
   });
}


setInterval(drawGame, 1000/framRate)
clearInterval()

io.on("connection", function(socket){
   //THIS SERVER WORKS FOR 1 CLIENT ONLY, A NEW USER ENTERING WILL CAUSE EVERYTHING TO RESTART
   grassEaten = 0;
   grassBurnt = 0;
   grassEaterEaten = 0;
   tilesExploded = 0;
   grassSprayed = 0;
   currentNumberOfGrass = 0;
   matrix = [];
   objects = [];
   createCanvas()
   socket.emit("initial", matrix)

   socket.on("disconnect", function(){
      console.log("A user left!")
      saveStatistics()
   })

   socket.on("onCheatClicked", function(x, y, radius, toIndex){
      if(!isValid(x,y)) return
      var spread = toIndex > 0

      for(var yy = y - radius; yy <= y + radius; yy++){
         for(var xx = x - radius; xx <= x + radius; xx++){
            if(isValid(xx,yy)){
               if(matrix[yy][xx] != 0){
                  GlobalMethods.deleteObject(xx,yy)
               }
               GlobalMethods.changeMatrix(xx,yy, toIndex, spread);
            }
         }
      }
      io.emit("updateWholeRect", matrix)
      
   })
   
   //CLICK EVENTS!

   //all the existing sherrifs in the game start shooting and moving faster for 10 turns
   socket.on("sherrifShowdown", function(){
      for(var i in objects){
         if(objects[i].id == 4){
            objects[i].goHam()
         }
      }
   })

   //randomly add grass in the game on empty tiles
   socket.on("grassDay", function(){
      for (let y = 0; y < yLength; y++) {
         for (let x = 0; x < xLength; x++) {
            if(matrix[y][x] == 0){
               var rand = Math.random() * 100;
               if(rand < 30){ //30% chance to add grass in an empty tile
                  matrix[y][x] = 1;
                  objects.push(GlobalMethods.classify(1, x, y));
               }
            }
         }

      }
   })

   //cause the edges to burn and some grass aswell.
   socket.on("burnTheWorld", function(){
      for (let y = 0; y < yLength; y++) {
         for (let x = 0; x < xLength; x++) {
            if(x == 0 || y == 0 || x == xLength - 1 || y == yLength - 1){ //add fire on the edge tiles
               if(matrix[y][x] != 0){
                  GlobalMethods.deleteObject(x,y)
               }
               matrix[y][x] = 98
               objects.push(GlobalMethods.classify(98,x,y))
            }

            else if(matrix[y][x] == 1){
               var rand = Math.random() * 100;
               if(rand < 10){ //10% chance to burn a random grass tile
                  GlobalMethods.deleteObject(x,y)

                  matrix[y][x] = 98;
                  objects.push(GlobalMethods.classify(98, x, y));
               }
            }
         }

      }
   })
   
})