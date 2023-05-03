class Sherrif extends Block { //moves around and shoots explosive bullets, that explode when it reaches the end, (doesn't die unless shot by another sherrif, or explodes himself, is purple).
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
            let direction = random(this.directions);
            let bulletX = direction[0];
            let bulletY = direction[1];
            //if direction is out of bounds, it's a waste of a bullet for the sherrif
            if (this.isValid(bulletX, bulletY)) {
                this.remove(bulletX, bulletY)
                changeMatrix(bulletX, bulletY, 99, false)
                objects.push(new ExplosiveBullet(bulletX, bulletY, [bulletX - this.x, bulletY - this.y]/* direction */))
            }
            this.shootStep = 0;
        }

        let coords = random(this.chooseCell(0)) //find empty space to move to
        if (coords == undefined) return;

        let x = coords[0];
        let y = coords[1];

        changeMatrix(x, y, this.id, false); //move to the desired place
        changeMatrix(this.x, this.y, 0, false); //replace previous position
        this.changeCoords(x, y); //update coordinates

        this.step = 0;

    }
}

//bullet that's shot by the sherrif (black)
class ExplosiveBullet extends Block {
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
            changeMatrix(x, y, this.id, false);
            changeMatrix(this.x, this.y, 0, false);
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
                            changeMatrix(xx,yy, 98, true)
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

//fire that's created by the explosion of the bullets (orange)
class Fire extends Block{
    constructor(x,y){
        super(x,y,1);
        this.id = 98;
    }

    move(){
        let grassCoords = random(this.chooseCell(1));
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

        this.remove(grassX, grassY) //remove the grass

        if(rand < 40){ //40% chance for the fire to spread.
            changeMatrix(grassX, grassY, this.id, true);
        }
        else{
            changeMatrix(grassX, grassY, this.id, false);
            changeMatrix(this.x, this.y, 0, false);
            this.changeCoords(grassX, grassY);
        }
    }
}