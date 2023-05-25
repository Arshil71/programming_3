const Block = require("./Block")

module.exports =  class Grass extends Block { //spreads around, is food for many objects (green).
    constructor(x, y) {
        super(x, y, 36);
        this.id = 1
        this.weatherChanged(currentWeather)
    }



    move() {
        if (++this.step < this.moveSpeed) return;

        let array = this.random(this.chooseCell(0));
        if (array == undefined) return;

        let x = array[0];
        let y = array[1];

        GlobalMethods.changeMatrix(x, y, 1, true);
        this.step = 0;

    }

    weatherChanged(weather){
        switch(weather){
            case "Spring":
                this.moveSpeed = 32;
                return;
            case "Summer":
                this.moveSpeed = 16;
                return;
            case "Fall":
                this.moveSpeed = 36;
                return;
            case "Winter":
                this.moveSpeed = 56;
        }
    }

}