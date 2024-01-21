const { stdin, stdout, exit } = process;
const { createWriteStream } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');
const writeFileStream = createWriteStream(filePath);

const promptMsg =
  'Please, enter some text (to stop script enter "exit" or press "Ctrl/Cmd + C"):\n';
const exitMsg = `
================================
Good luck learning in RS School!`;

stdout.write(promptMsg);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();

  writeFileStream.write(data);
});

process.on('SIGINT', () => {
  exit();
});

process.on('exit', () => {
  console.log(exitMsg);
});
