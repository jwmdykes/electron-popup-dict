const { getWindowPosition, showWindow, clickInBound } = require('./utils');
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

mousePosShell.on('stderr', function (stderr) {
  console.error(stderr)
});

textShell.on('stderr', function (stderr) {
  console.error(stderr);
});

mouseClickShell.on('stderr', function (stderr) {
  console.error(stderr);
});

const setMousePosCallback = (callback) => {
  mousePosShell.on('message', (message) => {
    callback(JSON.parse(message));
  });
};

const getMousePos = () => {
  console.log('getting mousePos');
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
  console.log("Trying to get text!");
  textShell.send('getText');
};

let currentMouseClickCallback = () => {};
const setMouseClickCallback = (callback) => {
  currentMouseClickCallback = callback;

  mouseClickShell.send('go');

  mouseClickShell.on('message', (message) => {
    callback();
  });
};

const defaultTextCallback = (win, app, text, PreviousText) => {
  console.log(`Got text: ${text.text}`);
  const winVisible = win.isVisible();
  const bounds = win.getBounds();

  const oldMouseClickCallback = currentMouseClickCallback;
  setMousePosCallback((res) => {
    // console.log(`MousePos result: ${JSON.stringify(res)}`);
    const mouseInWindow = clickInBound(res, bounds);
    if (winVisible && !mouseInWindow) {
      win.hide();
    } else {
      if (text.text !== '') {
        win.webContents.send('change-iframe', {
          url: `https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic`,
          text: text.text,
        });
      }
    }
  });

  getMousePos(); // get mouse position and do the mouse position callback
  console.log('REVERTING TO OLD CALLBACK!');
  setMousePosCallback(oldMouseClickCallback);
};

const defaultMousePosCallback = (win, app, mousePos) => {
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
};

const setupPythonShellCallbacks = (win, app) => {
  setTextCallback((text, PreviousText) =>
    defaultTextCallback(win, app, text, PreviousText)
  );
  setMousePosCallback((mousePos) =>
    defaultMousePosCallback(win, app, mousePos)
  );
};

module.exports = {
  getMousePos: getMousePos,
  getText: getText,
  setMouseClickCallback: setMouseClickCallback,
  setupPythonShellCallbacks: setupPythonShellCallbacks,
};
