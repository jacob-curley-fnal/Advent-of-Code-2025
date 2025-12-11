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
    })

    let numPaths = 0;
    function traverse(node) {
        if (!node) {
            return;
        }
        if (node.connections.has('out')) {
            if (!mappings.has('fft') && !mappings.has('dac')) numPaths++;
        } else {
            mappings.delete(node.key);
            for (const connection of node.connections) {
                traverse(mappings.get(connection));
            }
            mappings.set(node.key, node);
        }        
    }
    traverse(mappings.get('svr'));
    console.log(numPaths);
}