const Block = require("./Block")

//bullet that's shot by the sherrif (black)
module.exports = class ExplosiveBullet extends Block {
    constructor(x, y, direction) {
        super(x, y, 1);
        this.direction = direction;
        this.explosionRadius = 8;
        this.id = 99;
    }

    move() {
        let x = this.x + this.direction[0]; //where the bullet will move in terms of x
        let y = this.y + this.direction[1]; //where the bullet will move in terms of y
        if (this.isValid(x, y)) { //bullet destination is inside matrix.
            this.remove(x, y);
            GlobalMethods.changeMatrix(x, y, this.id, false);
            GlobalMethods.changeMatrix(this.x, this.y, 0, false);
            this.changeCoords(x, y);
        }
        else {
            this.remove(this.x, this.y);
            for (let xx = this.x - this.explosionRadius; xx < this.x + this.explosionRadius; xx++) {
                for (let yy = this.y - this.explosionRadius; yy < this.y + this.explosionRadius; yy++) {
                    if (this.isValid(xx, yy) && matrix[yy][xx] != 0) { //check if the block is in the matrix, and it's not an empty tile.
                        let random = Math.random() * 100;
                        if (random > 75) continue; //theres a 75% chance of deleting the block

                        if(matrix[yy][xx] == 1 /*grass detected */ && random < 5){ //5% chance to cause fire from the explosion
                            this.remove(xx, yy);
                            GlobalMethods.changeMatrix(xx,yy, 98, true)
                        }
                        else{
                            this.remove(xx, yy);
                        }
                    }
                }
            }
        }
    }
}
