class GrassEater extends Block { //eats grass (yellow)
    constructor(x, y) {
        super(x, y, 5);
        this.energy = 4;
        this.multiply = 10;
        this.target = 1 //grass
        this.id = 2;
    }

    move() {

        //check if object has energy,
        if (this.energy <= 0) {
            this.remove(this.x, this.y);
            return;
        }
        //check if it's time to move.
        if (++this.step < this.moveSpeed) return;

        //look for nearby targets
        let target = this.target
        let coords;
        do {
            coords = random(this.chooseCell(target--)); //look for nearby grass (target) -> then empty
        } while (coords == undefined && target >= 0)

        if (target == -1) this.energy--; //if no targets were nearby, (moved to empty space, or didn't find a place to move)
        else this.energy += target + 1;

        if (coords == undefined) return; //again, if no targets were nearby, do nothing (no empty space to move to).

        let x = coords[0];
        let y = coords[1];

        if (target != -1) this.remove(x, y); //remove object at destination (if it wasn't an empty space)

        changeMatrix(x, y, this.id, false) //update destination block to this object. (it's not multiplication!)

        // energy is enough to multiply
        if (this.energy >= this.multiply) {
            this.energy = 4;
            changeMatrix(this.x, this.y, this.id, true) //multiply at current position.
        }


        else { //energy < multiply
            changeMatrix(this.x, this.y, 0, false) //replace current position with empty.
        }
        this.changeCoords(x, y); //update coordinates.

        this.step = 0;
    }
}