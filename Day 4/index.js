class RollOfPaper {
    constructor(
        row,
        col
    ){
        this.row = row;
        this.col = col;
        this.accessible = false;
    }

    setAccessible(rolls) {
        const potentialNeighbors = [
            [this.row - 1, this.col + 1],
            [this.row, this.col + 1],
            [this.row + 1, this.col + 1],
            [this.row - 1, this.col],
            [this.row + 1, this.col],
            [this.row - 1, this.col - 1],
            [this.row, this.col - 1],
            [this.row + 1, this.col - 1],
        ];
        const numNeighbors = potentialNeighbors.reduce(
            (runningTotal, currentCoords) => runningTotal + (
                rolls.get(currentCoords[0])?.get(currentCoords[1]) === undefined ? 0 : 1
            ), 
            0
        );
        this.accessible = numNeighbors < 4;
    }
}

async function read(file) {
    const fileContents = await file.text();
    const rows = fileContents.split('\n');
    const rolls = new Map();
    rows.forEach((row, i) => {
        const cols = new Map();
        for (let col = 0; col < row.length; col++) {
            if (row.at(col) === '@') {
                cols.set(col, new RollOfPaper(i, col));
            }
        }
        rolls.set(i, cols);
    });
    let numRemoved = 0;
    while (true) {
        let removedThisIteration = 0;
        rolls.values().forEach(row => row.values().forEach(roll => roll.setAccessible(rolls)));
        rolls.values().forEach(row => {
            for (const [col, roll] of row.entries()) {
                if (roll.accessible) {
                    row.delete(col);
                    removedThisIteration++;
                }
            }
        });
        if (removedThisIteration > 0) {
            numRemoved += removedThisIteration;
        } else {
            break;
        }
    }
    console.log(numRemoved);
}