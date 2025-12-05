class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    compare(other) {
        const startDiff = this.start - other.start;
        if (startDiff === 0) {
            return this.end - other.end;
        }
        return startDiff;
    }

    contains(num) {
        return num >= this.start && num <= this.end;
    }

    getRangeSize() {
        return Math.abs(this.end - this.start) + 1;
    }

    hasOverlap(range) {
        return this.contains(range.start) || this.contains(range.end) || range.contains(this.start) || range.contains(this.end);
    }

    merge(range) {
        this.start = Math.min(this.start, range.start);
        this.end = Math.max(this.end, range.end);
    }
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const dbPartition = normalized.split('\n\n');
    let freshIdRanges = dbPartition[0].split('\n'); 
    freshIdRanges = freshIdRanges.map(row => {
        let rangeEnds = row.split('-').map(numStr => Number(numStr));
        return new Range(rangeEnds[0], rangeEnds[1]);
    });
    freshIdRanges.sort((a, b) => a.compare(b));
    freshIdRanges = freshIdRanges.reduce((mergedRanges, currentRange) => {
        const matchingIndex = mergedRanges.findIndex(range => range.hasOverlap(currentRange));
        if (matchingIndex >= 0) {
            mergedRanges[matchingIndex].merge(currentRange);
        } else {
            mergedRanges.push(currentRange);
        }
        return mergedRanges;
    }, []);
    const pantryItems = dbPartition[1].split('\n').map(str => Number(str));
    let numFresh = pantryItems.reduce(
        (count, id) => count + (freshIdRanges.some(range => range.contains(id)) ? 1 : 0), 
        0
    );
    console.log(
        'Number of fresh, available IDs:', 
        numFresh, 
        'Number of IDs that could be fresh:', 
        freshIdRanges.reduce(
            (runningTotal, range) => runningTotal + range.getRangeSize(), 
            0
        )
    );
}