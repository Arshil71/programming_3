const Block = require("./Block")

module.exports = class GrassEater extends Block { //eats grass (yellow)
    constructor(x, y, gender) {
        super(x, y, 5);
        
        this.gender = gender;
        this.energy = 4;
        this.multiply = 10;
        this.target = 1 //grass
        this.id = 2;

        this.moveSpeed += 1; //used to be able to adjust with weatherChanged()
        this.multiply += 3;
        this.weatherChanged(currentWeather)
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
            coords = this.random(this.chooseCell(target--)); //look for nearby grass (target) -> then empty
        } while (coords == undefined && target >= 0)

        if (target == -1) this.energy--; //if no targets were nearby, (moved to empty space, or didn't find a place to move)
        else this.energy += target + 1;

        if (coords == undefined) return; //again, if no targets were nearby, do nothing (no empty space to move to).

        let x = coords[0];
        let y = coords[1];

        if (target != -1) this.remove(x, y, this.id); //remove object at destination (if it wasn't an empty space)

        GlobalMethods.changeMatrix(x, y, this.id, false) //update destination block to this object. (it's not multiplication!)

        // energy is enough to multiply
        if (this.energy >= this.multiply) {
            if(this.gender == "female"){
                this.energy = 4;
                GlobalMethods.changeMatrix(this.x, this.y, this.id, true) //multiply at current position.
            }
            else{
                this.energy--; //to prevent having inifinite energy
                GlobalMethods.changeMatrix(this.x, this.y, 0, false) //replace current position with empty.
            } 
        }


        else { //energy < multiply
            GlobalMethods.changeMatrix(this.x, this.y, 0, false) //replace current position with empty.
        }
        this.changeCoords(x, y); //update coordinates.

        this.step = 0;
    }

    weatherChanged(weather){
        switch(weather){
            //-= and += are used to be able to handle both predator and grasseater variables accordingly
            case "Spring":
                this.moveSpeed -= 1;
                this.multiply -= 3;
                return;
            case "Summer":
                this.moveSpeed -= 1;
                this.multiply -= 3;
                return;
            case "Fall":
                this.moveSpeed += 1;
                this.multiply += 3;
                return;
            case "Winter":
                this.moveSpeed += 1;
                this.multiply += 3;
        }
    }
}