
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
    monitors: {
        left: {
            x0: 0,
            x1: 1920,
            y0: 0,
            y1: 1080
        },
        right: {
            x0: 1921,
            x1: 3840,
            y0: 0,
            y1: 1080,
        }
    }
}