const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })


    win.loadFile(path.join(__dirname, '../views/index.html'))
}

const registerHotkeys = () => {
    globalShortcut.register('esc', () => {
        console.log("esc")
        app.quit()
    })
}

app.whenReady().then(() => {
    registerHotkeys()
}).then(() => {
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

