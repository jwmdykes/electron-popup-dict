const { globalShortcut } = require('electron')
const { getMousePos, getText } = require('./python-shell.js')

const registerHotkeys = (win, app) => {
    globalShortcut.register('esc', () => {
        console.log("esc")
        app.quit()
    })

    globalShortcut.register('CommandOrControl+D', () => {
        console.log("ctrl+d")
        getText((text) => {
            console.log("RUNNING")
            console.log(text)
        })
        getMousePos((mousePos) => {
            win.setPosition(mousePos.x, mousePos.y)
            win.show()
        })
    })
}

module.exports = {
    registerHotkeys: registerHotkeys,
}