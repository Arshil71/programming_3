const Block = require("./Block")
const ExplosiveBullet = require("./ExplosiveBullet")

module.exports = class Sherrif extends Block { //moves around and shoots explosive bullets, that explode when it reaches the end, (doesn't die unless shot by another sherrif, or explodes himself, is purple).
    constructor(x, y) {
        super(x, y, 14);
        this.shootSpeed = 4
        this.shootStep = 0;
        this.id = 4;
    }

    move() {
        if (++this.step < this.moveSpeed) return;
        this.shootStep++;

        //check if it's time to shoot
        if (this.shootStep == this.shootSpeed) {
            let direction = this.random(this.directions);
            let bulletX = direction[0];
            let bulletY = direction[1];
            //if direction is out of bounds, it's a waste of a bullet for the sherrif
            if (this.isValid(bulletX, bulletY)) {
                this.remove(bulletX, bulletY)
                GlobalMethods.changeMatrix(bulletX, bulletY, 99, false)
                objects.push(new ExplosiveBullet(bulletX, bulletY, [bulletX - this.x, bulletY - this.y]/* direction */))
            }
            this.shootStep = 0;
        }

        let coords = this.random(this.chooseCell(0)) //find empty space to move to
        if (coords == undefined) return;

        let x = coords[0];
        let y = coords[1];

        GlobalMethods.changeMatrix(x, y, this.id, false); //move to the desired place
        GlobalMethods.changeMatrix(this.x, this.y, 0, false); //replace previous position
        this.changeCoords(x, y); //update coordinates

        this.step = 0;

    }
}

