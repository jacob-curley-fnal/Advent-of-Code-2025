async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const lines = normalized.split('\n').filter(line => line.trim().match(/^\.+$/) === null);
    const entryPoint = lines.shift().indexOf('S');
    let toSearch = new Map();
    toSearch.set(entryPoint, 1);
    let numWorlds = 1;
    for (const line of lines) {
        const nextToSearch = new Map();
        for ([beam, times] of toSearch.entries()) {
            if (line[beam] === '^') {
                nextToSearch.set(beam - 1, (nextToSearch.get(beam - 1) ?? 0) + times);
                nextToSearch.set(beam + 1, (nextToSearch.get(beam + 1) ?? 0) + times);
                numWorlds += times;
            } else {
                nextToSearch.set(beam, (nextToSearch.get(beam) ?? 0) + times);
            }
        }
        toSearch = nextToSearch;
    }
    console.log('Number of tachyon timelines:', numWorlds);
}