const { app, BrowserWindow } = require('electron');
const path = require('path');

const settings = require('./settings');

process.on('uncaughtException', (error) => {
  console.log(error);
  app.quit();
  process.exit();
});

const { registerHotkeys } = require('./hotkeys.js');

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

  // hide window when it goes out of focus
  win.on('blur', () => {
    win.hide();
  });

  win.loadFile(path.join(__dirname, '../views/naver/index.html'));
  return win;
};

app
  .whenReady()
  .then(() => {
    return createWindow();
  })
  .then((win) => {
    registerHotkeys(win, app);
  });

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// fixes cross origin error
app.commandLine.appendSwitch('disable-site-isolation-trials');
