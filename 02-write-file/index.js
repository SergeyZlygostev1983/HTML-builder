const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'message.txt'));
const { stdin, stdout } = require('process');

stdout.write('Enter the message:');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exitWithByeMessage();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => {
  exitWithByeMessage();
});

function exitWithByeMessage() {
  stdout.write('Good bye!!!');
  process.exit();
}
