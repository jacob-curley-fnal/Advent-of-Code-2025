async function read(file) {
    const fileContents = await file.text();
    let banks = fileContents.split('\n');
    banks = banks.map(bank => bank.trim());
    let sum = 0;
    for (const bank of banks) {
        let numString = "";
        let largestDigitIndex = -1;
        for (let neededInReserve = 11; neededInReserve > -1; neededInReserve--) {
            let largestDigit = 0;
            for (let i = largestDigitIndex + 1; i < bank.length - neededInReserve; i++) {
                const curNum = Number(bank.at(i));
                if (curNum > largestDigit) {
                    largestDigit = curNum;
                    largestDigitIndex = i;
                }
            }
            numString = `${numString}${largestDigit}`;
        }
        sum += Number(numString);
        console.log(`'${bank}'`, numString);
    }
    console.log(sum);
}