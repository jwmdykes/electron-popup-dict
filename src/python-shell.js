const { getMonitors, getWindowPosition, showWindow, clickInBound, getMousePos, changeIFrameURL} = require('./utils');
const { windowSize } = require('./settings');
const { PythonShell } = require('python-shell');
const path = require('path');

const textShell = new PythonShell(path.join(__dirname, 'py/getText.py'));

textShell.on('stderr', function (stderr) {
  console.error(stderr);
});

let PreviousText = { text: '' };
const setTextCallback = (callback) => {
  textShell.on('message', (message) => {
    const text = JSON.parse(message);
    callback(text, PreviousText);
    PreviousText = text;
  });
};

const getText = () => {
  console.log("Trying to get text!");
  textShell.send('getText');
};

const defaultTextCallback = async (win, app, text) => {
  console.log(`Got text: ${text.text}`);
  const winVisible = win.isVisible();
  const bounds = win.getBounds();
  console.log(`window bounds: ${bounds}`)

  const mousePos = getMousePos()

  const mouseInWindow = clickInBound(mousePos, bounds);
  console.log(`mouse is in window: ${mouseInWindow}`)

  if (winVisible && !mouseInWindow) {
    win.hide();
  } else if (text.text !== '') {
    console.log("changing iframe url!")
    changeIFrameURL(win, text.text)
  }

  await MoveWindowToCursor(win, app, mousePos)
  showWindow(win, app)
};

const MoveWindowToCursor = async (win, app, mousePos) => {
  const mons = await getMonitors(app)

  const bounds = [];
  for (const mon of mons) {
    mon.bounds.x1 = mon.bounds.x + mon.bounds.width;
    mon.bounds.y1 = mon.bounds.y + mon.bounds.height;
    bounds.push(mon.bounds);
  }

  const winPos = getWindowPosition(mousePos, bounds, windowSize);

  win.setPosition(winPos.x, winPos.y);
}

const setupPythonShellCallbacks = (win, app) => {
  setTextCallback((text, PreviousText) =>
    defaultTextCallback(win, app, text, PreviousText)
  );
};

module.exports = {
  getMousePos: getMousePos,
  getText: getText,
  setupPythonShellCallbacks: setupPythonShellCallbacks,
};
