const settings = require('./settings.js')

// show window helper to fix windows 10 issues with focus
const showWindow = (win, app) =>  {
    win.show()
    win.setAlwaysOnTop(true);
    if (win.isMaximized) {
        win.mainWindow?.maximize();
    } else {
        win.mainWindow?.showInactive();
    }

    win.mainWindow?.setAlwaysOnTop(false);
    win.mainWindow?.focus();
    app.focus({
        steal: true
    });
}

// get actual position of window from mouse position (uses size of window and monitor information to calculate appropriate position)
const getWindowPosition = (mousePos) => {
    x = mousePos.x
    y = mousePos.y

    let cur_mon;
    for (const [key, value] of Object.entries(settings.monitors)) {
        if ((value.x0 <= x) && (x <= value.x1) && (value.y0 <= y) && (y <= value.y1)) {
            cur_mon = value
            break
        }
    }
    // just return the mouse coordinates if we don't have info on this monitor
    if (!cur_mon) {
        return {x: x, y: y}
    }

    const size_x = settings.window.width
    const size_y = settings.window.height

    if (x + size_x > cur_mon.x1) {
        x -= size_x
    }

    if (y + size_y > cur_mon.y1) {
        y -= size_y
    }

    return {x: x, y:y}
 }

module.exports = {
    getWindowPosition: getWindowPosition,
    showWindow: showWindow
}