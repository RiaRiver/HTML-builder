const { stdout } = process;
const { createReadStream } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const inputFileSteam = createReadStream(filePath, 'utf-8');

inputFileSteam.pipe(stdout);
