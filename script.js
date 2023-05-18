//test
let socket = io()
let initialMatrix = []

var side = 15;


socket.on("initial", function(matrix){
    initialMatrix = matrix;
})

function setup(){
    createCanvas(initialMatrix[0].length * side, initialMatrix.length * side);
    background('#acacac');
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


function drawing(objects) {
    
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



//change an element in the matrix, and update the color on screen. 
function changeMatrix(x, y, value, spread){
    matrix[y][x] = value;
    drawRect(x,y);
    if(spread == true) objects.push(classify(value, x, y));
}

socket.on("objectsInfo", function(objects){
    drawing(objects)
})