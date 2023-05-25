const Block = require("./Block")

module.exports = class Fire extends Block{
    constructor(x,y){
        super(x,y,1);
        this.id = 98;
        this.die = 25;
        this.spreadChance = 40;
        this.weatherChanged(currentWeather)
    }

    move(){
        let grassCoords = this.random(this.chooseCell(1));
        if(grassCoords == undefined){
            this.remove(this.x, this.y);
            return;
        } 

        let rand = Math.random() * 100;
        if(rand < this.die) {
            this.remove(this.x, this.y) //25% chance for the fire to disapear regardless.
            return;
        }

        let grassX = grassCoords[0];
        let grassY = grassCoords[1];

        this.remove(grassX, grassY, this.id) //remove the grass

        if(rand < this.spreadChance){ //40% chance for the fire to spread.
            GlobalMethods.changeMatrix(grassX, grassY, this.id, true);
        }
        else{
            GlobalMethods.changeMatrix(grassX, grassY, this.id, false);
            GlobalMethods.changeMatrix(this.x, this.y, 0, false);
            this.changeCoords(grassX, grassY);
        }
    }

    weatherChanged(weather){
        switch(weather){
            case "Spring":
                this.die = 25;
                this.spreadChance = 40;
                return;
            case "Summer":
                this.die = 10;
                this.spreadChance = 60;
                return;
            case "Fall":
                this.die = 25;
                this.spreadChance = 40;
                return;
            case "Winter":
                this.die = 50;
                this.spreadChance = 20;
        }
    }
}