// Class numbers: EMPTY: 0, GRASS: 1, GRASS_EATER: 2, PREDATOR: 3, SHERRIF: 4, FARMER: 5 ,FIRE: 98, EXPLOSIVE_BULLET: 99, 

//is the main parent of all differrent class types.
class Block{
    constructor(x, y, moveSpeed){
        this.x = x;
        this.y = y;
        this.moveSpeed = moveSpeed; //how often the object moves.
        this.step = 0; //current step (if step == moveSpeed then move)
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    //checks and returns an array (coordinates) of a block with id = number
    chooseCell(number) {
        var found = [];
        for (var i in this.directions) {
            var x = this.directions[i][0];
            var y = this.directions[i][1];
            if (this.isValid(x,y)){

                if (matrix[y][x] == number){
                    found.push(this.directions[i]);
                }
                    
            }
        }
        return found;

    }

    //updates the coordinates of the block
    changeCoords(x,y){
        this.x = x;
        this.y = y;
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    //removes object at given coordinates.
    remove(x,y){
        for(var i in objects){
            if(x == objects[i].x && y == objects[i].y){
                objects.splice(i,1);
                changeMatrix(x,y, 0, false);
                return; //to break out of the loop, not keep searching for the object.
            }
        }
    }

    //checks whether or not [x,y] is in the matrix.
    isValid(x,y){
        return x >= 0 && y >= 0 && y < matrix.length && x < matrix[y].length;
    }
}


