async function read(file) {
    const fileContents = await file.text();
    const ranges = fileContents.split(',');
    let sum = 0;
    for (const range of ranges) {
        const ends = range.split('-');
        const start = Number(ends[0]);
        const end = Number(ends[1]);
        for (let cur = start; cur < end + 1; cur++) {
            const strVal = String(cur);
            for (let i = 1; i < Math.floor(strVal.length / 2) + 1; i++) {
                const segments = strVal.match(new RegExp(`.{1,${i}}`, 'g'));
                if (segments.every(val => val === segments[0])) {
                    sum += cur;
                    break;
                }
            }
        }
    }
    console.log(sum);
}