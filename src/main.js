const { app, BrowserWindow } = require('electron');
const path = require('path');

/////////////////////////////////////////////
// For debugging, print out errors to console
process.on('uncaughtException', (error) => {
  console.error(error.stack);
});
process.on('warning', (error) => {
  console.warn(error.stack);
});
// For debugging, print out errors to console
/////////////////////////////////////////////

const settings = require('./settings');
const { registerHotkeys } = require('./hotkeys.js');
const { setupPythonShellCallbacks } = require('./python-shell');

const createWindow = () => {
  const win = new BrowserWindow({
    width: settings.windowSize.width,
    height: settings.windowSize.height,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'inject-css.js'),
      webSecurity: false,
    },
  });
  win.hide();

  // settup callbacks hooks from python
  setupPythonShellCallbacks(win, app);

  // hide window when it goes out of focus
  win.on('blur', () => {
    win.hide();
  });

  win.loadFile(path.join(__dirname, '../views/naver/index.html'));
  return win;
};

// allow cross origin javascript so we can insert css into the iframe of the dictionary
app.commandLine.appendSwitch('disable-site-isolation-trials');

app
  .whenReady()
  .then(() => {
    return createWindow();
  })
  .then((win) => {
    registerHotkeys(win, app);
  });

// for macos, don't close the app when the last window is closed
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
