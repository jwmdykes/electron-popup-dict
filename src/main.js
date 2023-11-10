const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const settings = require('./settings');
const { globalShortcut} = require('electron');
const { dictQuery, getSelectedText} = require('./lib')

const createWindow = async () => {
  const win = new BrowserWindow({
    width: settings.windowSize.width,
    height: settings.windowSize.height,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.openDevTools({ mode: 'undocked' });
  // win.hide();

  // hide window when it goes out of focus
  // win.on('blur', () => {
  //   win.hide();
  // });

  let count = 0
  setInterval(() => {
    win.webContents.send("count", count++)
  }, 1000)

  let viewURL = path.join(__dirname, '../views/index.html')
  await win.loadFile(viewURL)

  return win
};

const registerHotkeys = (win, app) => {
  globalShortcut.register('CommandOrControl+D', async () => {
    const selectedText = getSelectedText()
    await dictQuery(win, app, selectedText);
    win.webContents.send('focus-search')
  });

  globalShortcut.register('CommandOrControl+T', () => {
    const selectedText = getSelectedText();
    console.log(`selected text: ${selectedText}`)
  })
};

// allow cross-origin javascript, so we can insert css into the iframe of the dictionary
app.commandLine.appendSwitch('disable-site-isolation-trials');

app
    .whenReady()
    .then(() => createWindow())
    .then((win) => registerHotkeys(win, app))
    .catch((error) => {
      console.error('Error:', error);
    });

// for macOS, don't close the app when the last window is closed
app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-settings', () => settings)