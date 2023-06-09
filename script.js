let socket = io()
let matrixx = []
let objectss = []

var side = 17;

var xLength = 50
var yLength = 50

//weather related variables
var currentWeatherr = "Spring"
var weatherDocument = document.getElementById("weather")

//cheat stuff
var cheatButton = document.getElementById("cheatButton")

var cheatMode = false
var cheatSheet = document.getElementById("cheatSheet")
var clickRadius = 0
var clickRadiusRange = document.getElementById("clickRadiusRange")
var toIndex = 5
var toIndexDocument = document.getElementById("toIndex")



//statistics related variables
var grassEatenDocument = document.getElementById("grassEaten")
var grassBurntDocument = document.getElementById("grassBurnt")
var grassEaterEatenDocument = document.getElementById("grassEaterEaten")
var tilesExplodedDocument = document.getElementById("tilesExploded")
var grassSprayedDocument = document.getElementById("grassSprayed")
var currentNumberOfGrassDocument = document.getElementById("currentNumberOfGrass")

socket.on("initial", function(matrix){
    matrixx = matrix;
})

window.addEventListener("click", function(){
    var xCoordinate = Math.floor(mouseX/side)
    var yCoordinate = Math.floor(mouseY/side)
    if(cheatMode){
        clickRadius = parseInt(clickRadiusRange.value)
        updateToIndex()
        socket.emit("onCheatClicked", xCoordinate, yCoordinate, clickRadius, toIndex)
    }
   
})

function setup(){
    createCanvas(xLength * side, yLength * side);
    background('#acacac');
}
 

function drawWholeRect() {
    for (var y = 0; y < matrixx.length; y++) {
        for (var x = 0; x < matrixx[y].length; x++) {
            drawRect(x,y, matrixx)
        }
    }


    // var p = document.createElement('p');
    // p.innerText = string;
    // chatDiv = document.getElementById("div")
    // chatDiv.appendChild(p);


}

function drawRect(x,y, matrix){
    let e = matrix[y][x];
       if (e == 1){
            if(currentWeatherr == "Spring") fill("green");
            else if(currentWeatherr =="Summer") fill(60, 240, 5)
            else if(currentWeatherr == "Winter") fill(220, 245, 220)
            else fill(150, 209, 0)
       } 
       else if(e == 2) fill("yellow");
       else if(e == 3) fill("red");
       else if(e == 4) fill("purple")
       else if(e == 5) fill("blue")
       else if(e == 98) fill("orange")
       else if(e == 99) fill("black")
       else  fill("#acacac");
    
       rect(x * side, y * side, side, side);
}

function updateToIndex(){
    switch(toIndexDocument.value){
        case "Empty":
            toIndex = 0;
            return;
        case "Grass":
            toIndex = 1;
            return;
        case "GrassEater":
            toIndex = 2;
            return;
        case "Predator":
            toIndex = 3;
            return;
        case "Sherrif":
            toIndex = 4;
            return;
        case "Sprayer":
            toIndex = 5;
            return;
        case "Fire":
            toIndex = 98;
            return;
    }
}

function sherrifShowdown(){
    socket.emit("sherrifShowdown");
}

function grassDay(){
    socket.emit("grassDay")
}

function burnTheWorld(){
    socket.emit("burnTheWorld")
}

socket.on("updateWholeRect", function(matrix, objects){
    matrixx =  matrix
    objectss = objects
    drawWholeRect()
})

socket.on("updateWeather", function(currentWeather){
    currentWeatherr = currentWeather
    weatherDocument.innerHTML = currentWeather
})

cheatButton.addEventListener("change", function(){
    cheatSheet.hidden = !cheatSheet.hidden //alternate between hiding and revealing cheatsheet
    cheatMode = !cheatMode
})

//STATISTIC RELATED SIGNAL:
socket.on("statistics", function(values){
    grassEatenDocument.innerHTML = "Grass Eaten: " + values[0];
    grassBurntDocument.innerHTML = "Grass Burnt: " + values[1];
    grassEaterEatenDocument.innerHTML = "Grass Eaters Eaten: " + values[2];
    tilesExplodedDocument.innerHTML = "Tiles Exploded: " + values[3];
    grassSprayedDocument.innerHTML = "Grass Sprayed: " + values[4];
    currentNumberOfGrassDocument.innerHTML = "Current Number of Grass: " + values[5];
})

