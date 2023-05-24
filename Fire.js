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
        if(rand > 75) {
            this.remove(this.x, this.y) //25% chance for the fire to disapear regardless.
            return;
        }

        let grassX = grassCoords[0];
        let grassY = grassCoords[1];

        this.remove(grassX, grassY, this.id) //remove the grass

        if(rand < 40){ //40% chance for the fire to spread.
            GlobalMethods.changeMatrix(grassX, grassY, this.id, true);
        }
        else{
            GlobalMethods.changeMatrix(grassX, grassY, this.id, false);
            GlobalMethods.changeMatrix(this.x, this.y, 0, false);
            this.changeCoords(grassX, grassY);
        }
    }
}