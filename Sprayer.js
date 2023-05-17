const Block = require("./Block")

module.exports = class Sprayer extends Block{ //boosts the growth of nearby grass (blue)
    constructor(x,y){
        super(x,y, 34);

        this.effectRadius = 3; //the radius of which grass is boosted
        this.spreadRadius = 2; //radius of grass spread
        this.id = 5; 
    }

    //doesn't move, but boosts grass spread
    move(){
        //check if it's time to spray water.
        if (++this.step < this.moveSpeed) return;

        let grass = [];

        //look for nearby grass in the radius of this.effectRadius.
        for (let xx = this.x - this.effectRadius; xx < this.x + this.effectRadius; xx++) {
            for (let yy = this.y - this.effectRadius; yy < this.y + this.effectRadius; yy++) {
                if(this.isValid(xx,yy)){
                   if(matrix[yy][xx] == 1) grass.push([xx,yy]); //if tile is grass, add to array.
                   else if(matrix[yy][xx] == 98) this.remove(xx,yy); //if there is fire nearby, take it down (but is not guranteed to catch the fire due to its speed)
                }
            }
        }
        
        for(let i in grass){
            this.spreadGrass(grass[i][0], grass[i][1]);
        }
        this.step = 0;
    }

    //spreads grass in all directions of this.radius of the given coordinates (if tile is empty).
    spreadGrass(x, y) {
        for (let xx = x - this.spreadRadius; xx < x + this.spreadRadius; xx++){
            for (let yy = y - this.spreadRadius; yy < y + this.spreadRadius; yy++){
                if(this.isValid(xx,yy) && matrix[yy][xx] == 0) changeMatrix(xx, yy, 1, true) //if empty, add grass
            }
        }
    }
}