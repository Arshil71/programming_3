let socket = io()
let initialMatrix = []

var side = 15;

var xLength = 70
var yLength = 70

socket.on("initial", function(matrix){
    initialMatrix = matrix;
})

window.addEventListener("click", function(){
    var string = mouseX + mouseY
    var p = document.createElement('p');
    p.innerText = string;
    chatDiv = document.getElementById("div")
    chatDiv.appendChild(p);
})

function setup(){
    createCanvas(xLength * side, yLength * side);
    background('#acacac');
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

function drawRect(x,y, matrix){
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

socket.on("drawRect", function(x,y, matrix){
    drawRect(x,y, matrix)
})