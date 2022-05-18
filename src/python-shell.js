const { getWindowPosition, showWindow } = require('./utils');
const { windowSize, getMonitors } = require('./settings');
const { PythonShell } = require('python-shell');
const path = require('path');

const mousePosShell = new PythonShell(
  path.join(__dirname, 'py/getMousePos.py')
);
const textShell = new PythonShell(path.join(__dirname, 'py/getText.py'));
const mouseClickShell = new PythonShell(
  path.join(__dirname, 'py/sendMouseClick.py')
);

const setMousePosCallback = (callback) => {
  mousePosShell.on('message', (message) => {
    callback(JSON.parse(message));
  });
};

const getMousePos = (callback) => {
  mousePosShell.send('getMousePos');
};

PreviousText = { text: '' };
const setTextCallback = (callback) => {
  textShell.on('message', (message) => {
    const text = JSON.parse(message);
    callback(text, PreviousText);
    PreviousText = text;
  });
};

const getText = (callback) => {
  textShell.send('getText');
};

const setMouseClickCallback = (callback) => {
  mouseClickShell.send('go');

  mouseClickShell.on('message', (message) => {
    callback();
  });
};

let setupPythonShellCallbacks = (win, app) => {
  setTextCallback((text, PreviousText) => {
    if (text.text !== '' && text.text !== PreviousText.text) {
      win.webContents.send('change-iframe', {
        url: 'https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic',
        text: text.text,
      });
      getMousePos();
    } else {
      win.hide();
    }
  });
  setMousePosCallback((mousePos) => {
    // console.log(`MOUSEPOS: ${JSON.stringify(mousePos)}`)
    getMonitors(app)
      .then((mons) => {
        // console.log(JSON.stringify(mons))
        const bounds = [];
        for (const mon of mons) {
          mon.bounds.x1 = mon.bounds.x + mon.bounds.width;
          mon.bounds.y1 = mon.bounds.y + mon.bounds.height;
          bounds.push(mon.bounds);
        }
        return bounds;
      })
      .then((bounds) => {
        const winPos = getWindowPosition(mousePos, bounds, windowSize);
        return winPos;
      })
      .then((winPos) => {
        win.setPosition(winPos.x, winPos.y);
      })
      .then(() => {
        showWindow(win, app);
      });
  });
};

module.exports = {
  getMousePos: getMousePos,
  getText: getText,
  setMouseClickCallback: setMouseClickCallback,
  setupPythonShellCallbacks: setupPythonShellCallbacks,
};
