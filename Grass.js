class Grass extends Block { //spreads around, is food for many objects (green).
    constructor(x, y) {
        super(x, y, 36);
    }



    move() {
        if (++this.step < this.moveSpeed) return;

        let array = random(this.chooseCell(0));
        if (array == undefined) return;

        let x = array[0];
        let y = array[1];

        changeMatrix(x, y, 1, true);
        this.step = 0;

    }

}