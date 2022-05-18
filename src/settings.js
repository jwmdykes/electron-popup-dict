
getMonitors = (app) => {
    return app.whenReady().then(() => {
        const { screen } = require("electron")
        const displays = screen.getAllDisplays()
        return displays
    })
}

module.exports = {
    windowSize: {
        width: 500,
        height: 550,
    },
    getMonitors: getMonitors,
}