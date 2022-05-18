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

const setMousePosCallback = (callback) => {
  mousePosShell.on('message', (message) => {
    callback(JSON.parse(message));
  });
};

const getMousePos = () => {
  mousePosShell.send('getMousePos');
};

const oneShotMousePos = () => {
  // wrap it in a promise, and `await` the result
  const result = new Promise((resolve, reject) => {
    PythonShell.run(
      path.join(__dirname, 'py/oneShotMousePos.py'),
      null,
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
  return result;
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

const defaultTextCallback = (win, app, text, PreviousText) => {
  const winVisible = win.isVisible();
  const bounds = win.getBounds();
  oneShotMousePos() // check if the mouse is already in the window
    .then((res) => {
      const mouseInWindow = clickInBound(JSON.parse(res), bounds);
      if (winVisible && !mouseInWindow) {
        win.hide();
        return false;
      } else if (winVisible) {
        return false;
      } else {
        return true;
      }
    })
    .then((keepGoing) => {
      if (keepGoing) {
        if (text.text !== '' && text.text !== PreviousText.text) {
          win.webContents.send('change-iframe', {
            url: 'https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic',
            text: text.text,
          });
          getMousePos(); // get mouse position and do the mouse position callback
        }
      }
    });
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

let setupPythonShellCallbacks = (win, app) => {
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
  oneShotMousePos: oneShotMousePos,
};
