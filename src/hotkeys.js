const { globalShortcut} = require('electron')
const { getMousePos, getText } = require('./python-shell.js')
const { getWindowPosition, showWindow } = require("./utils")

const registerHotkeys = (win, app) => {
    globalShortcut.register('esc', () => {
        console.log("esc")
        app.quit()
    })

    globalShortcut.register('CommandOrControl+D', () => {
        // console.log("ctrl+d")
        getText((text) => {
            // console.log(text)
            win.webContents.send('change-iframe', {
                url: "https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic",
                text: text.text
            })
        })
        getMousePos((mousePos) => {
            // console.log(`MOUSEPOS: ${JSON.stringify(mousePos)}`)
            const winPos = getWindowPosition(mousePos) 
            // console.log(`WINDOWPOS: ${JSON.stringify(winPos)}`)
            win.setPosition(winPos.x, winPos.y)
            showWindow(win, app)
        })
    })
}

module.exports = {
    registerHotkeys: registerHotkeys,
}