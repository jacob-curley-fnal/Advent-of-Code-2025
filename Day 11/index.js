class Node {
    constructor(key, connections) {
        this.key = key;
        this.connections = connections;
    }
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const list = normalized.split('\n');

    const mappings = new Map();
    list.forEach(entry => {
        const delimiterInx = entry.indexOf(':');
        const key = entry.substring(0, delimiterInx);
        const node = new Node(key, new Set(entry.substring(delimiterInx + 1).trim().split(' ')));
        mappings.set(key, node);
    });
    mappings.set('out', new Node('out', new Set()));

    const mapVals = [...mappings.values()];
    const topologicalSort = [];
    const noIncoming = [mappings.get('svr')];
    while (noIncoming.length > 0) {
        const node = noIncoming.pop();
        topologicalSort.push(node);
        for (const conn of node.connections) {
            if (mapVals.every((value) => topologicalSort.find(sorted => sorted.key === value.key) || !value.connections.has(conn))) {
                const other = mappings.get(conn);
                noIncoming.push(other);
            }
        }
    }

    console.log(topologicalSort);

    function traverse(node, seenDac, seenFft) {
        if (node.key === 'out') {
            return seenDac && seenFft ? 1 : 0;
        }
        if (node.key === 'fft') {
            seenFft = true;
        }
        if (node.key === 'dac') {
            seenDac = true;
        }
        let sum = 0;
        const thisIndex = topologicalSort.findIndex(val => val.key === node.key);
        for (const connection of node.connections) {
            if (topologicalSort.findIndex(val => val.key === connection) > thisIndex) {
                sum += traverse(mappings.get(connection), seenDac, seenFft);
            }
        }
        return sum;
    }
    let numPaths = traverse(mappings.get('svr'), false, false);
    console.log(numPaths);
}