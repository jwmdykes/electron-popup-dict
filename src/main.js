const { app, BrowserWindow} = require('electron')
const path = require('path')

process.on('uncaughtException', (error) => {
    console.log(error)
    app.quit()
    process.exit()
})

const { registerHotkeys } = require('./hotkeys.js')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    })

    win.loadFile(path.join(__dirname, '../views/index.html'))
    // hide window when it goes out of focus
    win.on('blur', () => {
        win.hide()
    })
    return win
}

app.whenReady().then(() => {
    return createWindow()
}).then((win) => {
    registerHotkeys(win, app)
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// fixes cross origin error
app.commandLine.appendSwitch('disable-site-isolation-trials')
