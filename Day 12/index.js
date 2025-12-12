function countSpaces(row) {
    return row.split('').reduce((sum, char) => sum + (char === '#' ? 1 : 0), 0);
}

class Shape {
    constructor(row1, row2, row3) {
        this.row1 = row1;
        this.row2 = row2;
        this.row3 = row3;
        this.totalSpaces = countSpaces(row1) + countSpaces(row2) + countSpaces(row3);
    }
}

class Area {
    constructor(length, width, shapeCounts) {
        this.length = length;
        this.width = width;
        this.area = length * width;
        this.shapeCounts = shapeCounts;
    }
}

function fitShapes(area, shapes) {
    if ((Math.floor(area.length / 3) * Math.floor(area.width / 3)) >= area.shapeCounts.reduce((sum, count) => sum + count, 0)) {
        // total area allows for a naive placement
        return true;
    }

    return false;

}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const list = normalized.trim().split('\n');
    const inputBreakpoint = list.findLastIndex(line => line === '') + 1;
    const shapesSegment = list.slice(0, inputBreakpoint);
    const areasSegment = list.slice(inputBreakpoint);

    const shapes = [];
    let row1 = '';
    let row2 = '';
    let row3 = '';
    for (const line of shapesSegment) {
        if (line === '') {
            shapes.push(new Shape(row1, row2, row3));
            row1 = '';
            row2 = '';
            row3 = '';
        } else if (line.match(/[.#]{3}/)) {
            if (row1 === '') {
                row1 = line;
            } else if (row2 === '') {
                row2 = line;
            } else {
                row3 = line;
            }
        }
    }

    let areas = [];
    for (const line of areasSegment) {
        const areaParts = line.split(':');
        const lengthWidth = areaParts[0].split('x');
        const shapeCounts = areaParts[1].trim().split(' ').map(str => Number(str));
        areas.push(new Area(Number(lengthWidth[0]), Number(lengthWidth[1]), shapeCounts));
    }
    console.log(shapes, areas);

    areas = areas.filter(area => area.area >= area.shapeCounts.reduce((sum, shapeCount, inx) => sum + (shapeCount * shapes[inx].totalSpaces), 0));
    
    areas = areas.filter(area => fitShapes(area));

    console.log(areas);
}