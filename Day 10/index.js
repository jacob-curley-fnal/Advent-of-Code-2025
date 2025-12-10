class Button {
    constructor(lightsStr) {
        this.lights = lightsStr.split(',').map(light => Number(light));
    }
}

class MachineSchematic {
    constructor(targetLightLayout, buttons, joltages) {
        this.targetLightLayout = targetLightLayout;
        this.buttons = buttons;
        this.targetJoltages = joltages;
    }

    matchesTargetLightConfig(lights) {
        return this.targetLightLayout.every((light, index) => light === lights[index]);
    }

    matchesTargetJoltConfig(jolts) {
        return this.targetJoltages.every((jolt, index) => jolt === jolts[index]);
    }

    makeButtonPressCombos() {
        const result = [];
        const f = function(prefix, buttons) {
            for (let i = 0; i < buttons.length; i++) {
                result.push([...prefix, buttons[i]]);
                f([...prefix, buttons[i]], buttons.slice(i + 1));
            }
        }
        f([], this.buttons);
        return result;
    }

    getNumButtonPressesLights() {
        let combos = this.makeButtonPressCombos();
        combos = combos.sort((a, b) => a.length - b.length);
        
        const result = combos.find(combo => {
            const lights = new Array(this.targetLightLayout.length);
            lights.fill(false);
            combo.forEach(button => button.lights.forEach(light => lights[light] = !lights[light]));
            return this.matchesTargetLightConfig(lights);
        });
        
        if (result) {
            return result.length;
        }
        console.log('failed to find solution');
        return -1;
    }

    getNumButtonPressesJoltages() {
        const converted = this.buttons.map(button => {
            const vec = new Array(this.targetJoltages.length);
            vec.fill(0);
            button.lights.forEach(light => vec[light] = 1);
            return vec;
        });
        let display = `[${this.targetJoltages}] = `;
        display += converted.map((vec, index) => `x${index} * [${vec}]`).join(' + ');
        console.log(display);
        return -1;
    }
}

function schematicFrom(initializationString) {
    const targetLightLayout = [];
    for (const light of initializationString.substring(1, initializationString.indexOf(']'))) {
        targetLightLayout.push(light === '#');
    }

    const buttons = [...initializationString.matchAll(/\(([\d,]+)\)/g)].map(lights => new Button(lights[1]));
    
    const joltages = initializationString.match(/\{[\d,]+\}/)[0].replaceAll(/[{}]/g, '').split(',').map(str => Number(str));

    return new MachineSchematic(targetLightLayout, buttons, joltages);
}

async function read(file) {
    const fileContents = await file.text();
    const normalized = fileContents.replaceAll('\r\n', '\n');
    const schematics = normalized.split('\n').map(str => schematicFrom(str));
    console.log('Sum button presses for lights:', schematics.reduce((sum, schematic) => sum + schematic.getNumButtonPressesLights(), 0));
    console.log('Sum button presses for joltages:', schematics.reduce((sum, schematic) => sum + schematic.getNumButtonPressesJoltages(), 0));

}