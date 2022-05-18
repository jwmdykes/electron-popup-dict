const { PythonShell } = require('python-shell');
const path = require('path');
const mousePosShell = new PythonShell(
  path.join(__dirname, 'py/getMousePos.py')
);
const textShell = new PythonShell(path.join(__dirname, 'py/getText.py'));
const mouseClickShell = new PythonShell(
  path.join(__dirname, 'py/sendMouseClick.py')
);

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

const setMouseClickCallback = (callback) => {
  mouseClickShell.send('go');

  mouseClickShell.on('message', (message) => {
    // console.log(`GOT MESSAGE: ${message}`);
    callback();
  });
};

module.exports = {
  getMousePos: getMousePos,
  getText: getText,
  setMouseClickCallback: setMouseClickCallback,
};
