const { PythonShell } = require('python-shell');
const path = require('path');
let mousePosShell = new PythonShell(path.join(__dirname, 'py/getMousePos.py'));
let textShell = new PythonShell(path.join(__dirname, 'py/getText.py'));

const getMousePos = (callback) => {
  mousePosShell.send('getMousePos');

  mousePosShell.on('message', (message) => {
    callback(JSON.parse(message));
  });
};

const getText = (callback) => {
  textShell.send('getText');

  textShell.on('message', (message) => {
    callback(JSON.parse(message));
  });
};

module.exports = {
  getMousePos: getMousePos,
  getText: getText,
};
