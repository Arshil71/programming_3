const Block = require("./Block")

module.exports = class Fire extends Block{
    constructor(x,y){
        super(x,y,1);
        this.id = 98;
    }

    move(){
        let grassCoords = this.random(this.chooseCell(1));
        if(grassCoords == undefined){
            this.remove(this.x, this.y);
            return;
        } 

        let rand = Math.random() * 100;
        if(rand > this.weatherAffect(75, true)) {
            this.remove(this.x, this.y) //25% chance for the fire to disapear regardless.
            return;
        }

        let grassX = grassCoords[0];
        let grassY = grassCoords[1];

        this.remove(grassX, grassY, this.id) //remove the grass

        if(rand < this.weatherAffect(40, false)){ //40% chance for the fire to spread.
            GlobalMethods.changeMatrix(grassX, grassY, this.id, true);
        }
        else{
            GlobalMethods.changeMatrix(grassX, grassY, this.id, false);
            GlobalMethods.changeMatrix(this.x, this.y, 0, false);
            this.changeCoords(grassX, grassY);
        }
    }

    weatherAffect(rand, bigger){
        var sign = 1
        if(bigger) sign = -1
        switch(currentWeather){
            case "Spring":
                return rand;
            case "Summer":
                return rand + (-35 * sign);
            case "Fall":
                return rand;
            case "Winter":
                return rand + (35 * sign);
        }
    }
}