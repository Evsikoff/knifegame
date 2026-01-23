const fs = require('fs');

const msdfFont = JSON.parse(fs.readFileSync('./font-output/MyFont.json', 'utf-8'));
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const playcanvasChars = {};
const glyphSize = 28; // тот же размер что при генерации

msdfFont.chars.forEach(char => {
    playcanvasChars[char.id] = {
        id: char.id,
        letter: char.char,
        x: char.x,
        y: char.y,
        width: char.width + 2,
        height: char.height + 2,
        map: char.page || 0,
        xadvance: char.xadvance,
        xoffset: (glyphSize/2 - char.xoffset - 1) + 8, // Сдвинет текст вправо
        yoffset: char.yoffset - 15,
        scale: 1,
        range: 4,
        bounds: [0, 0, char.width, char.height]
    };
});

config.assets['262834524'].data = {
    version: 2,
    intensity: 0,
    info: {
        face: "MyFont",
        maps: [{ width: msdfFont.common.scaleW, height: msdfFont.common.scaleH }]
    },
    chars: playcanvasChars
};

fs.writeFileSync('./config.json', JSON.stringify(config));
console.log('Done!', Object.keys(playcanvasChars).length, 'chars');
