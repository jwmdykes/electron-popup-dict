const {app, BrowserWindow, ipcMain, BrowserView} = require('electron');
const path = require('path');

const settings = require('./settings');
const {registerHotkeys, changeWebView} = require('./lib');

let mainWindow;
let browserView;

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        backgroundColor: settings.backgroundColor,
        width: settings.windowSize.width,
        height: settings.windowSize.height,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    // mainWindow.openDevTools({mode: 'undocked'});
    mainWindow.hide();

    // hide window when it goes out of focus
    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    let viewURL = path.join(__dirname, '../views/index.html');
    await mainWindow.loadFile(viewURL);

    browserView = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'browserViewPreload.js'),
        }
    });
    browserView.setBackgroundColor(settings.backgroundColor)
    // browserView.webContents.openDevTools()
    browserView.setBounds({x: 0, y: 45, width: settings.windowSize.width, height: settings.windowSize.height - 45});

    mainWindow.setBrowserView(browserView);
    registerHotkeys(mainWindow, browserView, app);

    ipcMain.handle('get-css', () => settings.css)
    ipcMain.handle('change-webview', async (event, text) => {
        await changeWebView(mainWindow, browserView, text);
    })
};


app
    .whenReady()
    .then(async () => {
        await createWindow();
    })
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