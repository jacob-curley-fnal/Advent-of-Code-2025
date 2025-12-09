class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    areaBetween(other) {
        return (Math.abs(this.x - other.x) + 1) * (Math.abs(this.y - other.y) + 1);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

class LineSegment {
    constructor(pointA, pointB) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.isHorizontal = pointA.y === pointB.y;
        this.staticCoord = this.isHorizontal ? pointA.y : pointA.x;
        this.maxDynamicCoord = this.isHorizontal ? Math.max(pointA.x, pointB.x) : Math.max(pointA.y, pointB.y);
        this.minDynamicCoord = this.isHorizontal ? Math.min(pointA.x, pointB.x) : Math.min(pointA.y, pointB.y);
        this.isPoint = pointA.equals(pointB);
    }

    crosses(other) {
        if (this.isPoint || other.isPoint || this.isHorizontal === other.isHorizontal) {
            return false;
        }
        return (this.maxDynamicCoord > other.staticCoord &&
            this.minDynamicCoord < other.staticCoord &&
            other.maxDynamicCoord > this.staticCoord &&
            other.minDynamicCoord < this.staticCoord);
    }

    equals(other) {
        return (this.pointA.x === other.pointA.x &&
                this.pointA.y === other.pointA.y &&
                this.pointB.x === other.pointB.x &&
                this.pointB.y === other.pointB.y);
    }
}

function isInside(point, polygon) {
    if (polygon.some(seg => seg.pointA.equals(point) || seg.pointB.equals(point))) {
        return true;
    }
    let inside = false;
    for (const lineSegment of polygon) {
        const x1 = lineSegment.pointA.x;
        const y1 = lineSegment.pointA.y;
        const x2 = lineSegment.pointB.x;
        const y2 = lineSegment.pointB.y;
        if (((y1 > point.y) !== (y2 > point.y)) &&
            (point.x < (x2 - x1) * (point.y - y1) / (y2 - y1) + x1)) {
            inside = !inside;
        }
    }
    return inside;
}

class Rectangle {
    constructor(pointA, pointB) {
        const pointAB = new Point(pointA.x, pointB.y);
        const pointBA = new Point(pointB.x, pointA.y);
        this.borders = [
            new LineSegment(pointA, pointBA),
            new LineSegment(pointBA, pointB),
            new LineSegment(pointB, pointAB),
            new LineSegment(pointAB, pointA),
        ];
        this.area = pointA.areaBetween(pointB);
    }

    extendsOutside(polygon) {
        if (this.borders.every(border => isInside(border.pointA, polygon) && isInside(border.pointB, polygon))) {
            return this.borders.some(border => polygon.some(seg => border.crosses(seg)));
        }
        return true;
    }
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const points = normalized.split('\n').map(line => {
        const coords = line.split(',');
        return new Point(Number(coords[0]), Number(coords[1]));
    });

    const validArea = points.map((pointA, index) => {
        const pointB = points[(index + 1) % points.length];
        return new LineSegment(pointA, pointB);
    });

    let maxArea = 0;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const rect = new Rectangle(points[i], points[j]);
            if (rect.area > maxArea && !rect.extendsOutside(validArea)) {
                maxArea = rect.area;
                console.log('New Biggest:', rect);
            }
        }
    }
    console.log('Largest area between two corners:', maxArea);
}