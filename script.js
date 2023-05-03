var xLength = 100;
var yLength = 100;

var matrix = [];
var objects = [];


var frameRate = 60;

var side = 10;


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

    frameRate(frameRate);
    createCanvas(matrix[0].length * side, matrix.length * side);
    background('#acacac');

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

function draw() {
    
    /*for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            let value = matrix[y][x];
            let object = null;
            
            if(value == 1) object = new Grass(x,y);
            if(object == null) continue;
            object.move();
            object = null;

        }
    }*/

    for(let i in objects){
        objects[i].move();
    }

}

//return the class version of a given id.
function classify(number, x, y){
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
}

//update color of square (rectangle) on the screen.
function drawRect(x,y){
    let e = matrix[y][x];
    if (e == 1) fill("green");
    else if(e == 2) fill("yellow");
    else if(e == 3) fill("red");
    else if(e == 4) fill("purple")
    else if(e == 5) fill("blue")
    else if(e == 98) fill("orange")
    else if(e == 99) fill("black")
    else  fill("#acacac");

    rect(x * side, y * side, side, side);
}

//change an element in the matrix, and update the color on screen. 
function changeMatrix(x, y, value, spread){
    matrix[y][x] = value;
    drawRect(x,y);
    if(spread == true) objects.push(classify(value, x, y));
}