class Predator extends GrassEater { //eats grass eaters, if none are nearby, eats grass, otherwise moves (red).
    constructor(x, y) {
        super(x, y)
        this.energy = 5
        this.multiply = 18
        this.target = 2 //grass eater
        this.id = 3;
        this.moveSpeed = 8;
    }
}
