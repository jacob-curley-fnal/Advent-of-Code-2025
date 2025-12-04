async function read(file) {
    const fileContents = await file.text();
    const rotations = fileContents.split('\n');
    let curNum = 50;
    let zero_count = 0;
    for (const rotation of rotations) {
        const direction = rotation.substring(0,1) === 'L' ? -1 : 1;
        let amount = Number(rotation.substring(1));
        while (amount > 0) {
            curNum += direction;
            if (curNum === -1) {
                curNum = 99;
            } else if (curNum === 100) {
                curNum = 0;
            } 
            if (curNum === 0) {
                zero_count++;
            }
            amount--;
        }
    }
    console.log(zero_count);
}