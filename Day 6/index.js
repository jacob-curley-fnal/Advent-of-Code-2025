class Problem {
    values = [];
    operator = '';

    insert(item) {
        if (item.match(/[0-9]+/)) {
            this.values.push(item);
        } else if (item.match(/[+\-*\/]/)) {
            this.operator = item.trim();
        }
    }

    print() {
        console.log(this.values.map(str => str.trim()).join(` ${this.operator} `) + ' = ' + this.solve());
    }

    reorient() {
        const longestNumLength = this.values.reduce((max, entry) => Math.max(max, entry.length), 0);
        const reoriented = [];
        for (let i = longestNumLength - 1; i >= 0; i--) {
            const reorientedRow = this.values.reduce(
                (num, entry) => num + entry[i].trim(), 
                ''
            );
            if (reorientedRow.length > 0) {
                reoriented.push(reorientedRow);
            }
        }
        this.values = reoriented;
    }

    solve() {
        switch (this.operator) {
            case '+':
                return this.values.map(str => Number(str)).reduce((a, b) => a + b, 0);
            case '-':
                return this.values.map(str => Number(str)).reduce((a, b) => a - b);
            case '*':
                return this.values.map(str => Number(str)).reduce((a, b) => a * b, 1);
            case '/':
                return this.values.map(str => Number(str)).reduce((a, b) => a / b);
            default:
                return null;
        }    
    }
}

function findCols(rows) {
    const colsMap = new Map();
    rows.forEach(row => {
        let i = 0;
        while (i < row.length) {
            i = row.indexOf(' ', i);
            if (i === -1) break;
            if (!colsMap.has(i)) {
                colsMap.set(i, 1);
            } else {
                colsMap.set(i, colsMap.get(i) + 1);
            }
            i++;
        }
    });
    return Array.from(colsMap.entries()).filter(([col, count]) => count === rows.length).map(([col, count]) => col);
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const lines = normalized.split('\n');
    const cols = findCols(lines).sort((a, b) => a - b);
    const problems = [];
    const initalRow = lines.shift();
    cols.push(initalRow.length);
    cols.forEach((col, colIndex) => {
        const problem = new Problem();
        problem.insert(initalRow.substring(colIndex === 0 ? 0 : cols[colIndex - 1], col));
        problems.push(problem);
    });
    lines.forEach(line => {
        cols.forEach((col, colIndex) => {
            const problem = problems[colIndex];
            problem.insert(line.substring(colIndex === 0 ? 0 : cols[colIndex - 1], col));
        });
    });

    problems.forEach(problem => problem.reorient());

    console.log('Problems sum:', problems.reduce((sum, problem) => sum + problem.solve(), 0));
}