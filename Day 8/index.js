class JunctionBox {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distanceTo(other) {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2 + (this.z - other.z)**2);
    }
}

class ShortestDistance {
    constructor(boxA, boxB) {
        this.distance = boxA.distanceTo(boxB);
        this.boxA = boxA;
        this.boxB = boxB;
    }
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    let boxes = normalized.split('\n').map(line => {
        const coords = line.split(',');
        return new JunctionBox(Number(coords[0]), Number(coords[1]), Number(coords[2]));
    });
    const shortestDistances = [];
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            shortestDistances.push(new ShortestDistance(boxes[i], boxes[j]));
        }
    }
    shortestDistances.sort((a, b) => a.distance - b.distance);
    const circuits = [];
    for (dis of shortestDistances) {
        let existingCircuitA = circuits.find(circuit => circuit.includes(dis.boxA));
        let existingCircuitB = circuits.find(circuit => circuit.includes(dis.boxB));
        if (existingCircuitA) {
            if (existingCircuitB) {
                if (existingCircuitA !== existingCircuitB) {
                    existingCircuitA.push(...existingCircuitB);
                    circuits.splice(circuits.findIndex(circuit => circuit === existingCircuitB), 1);
                }
            } else {
                existingCircuitA.push(dis.boxB);
            }
        } else if (existingCircuitB) {
            existingCircuitB.push(dis.boxA);
        } else {
            circuits.push([dis.boxA, dis.boxB]);
        }
        if (circuits[0].length === boxes.length) {
            console.log(dis.boxA.x * dis.boxB.x);
            break;
        }
    }
}