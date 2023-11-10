// show window helper to fix Windows 10 issues with focus
const { screen } = require('electron')

function getMousePos() {
  let mousePos = screen.getCursorScreenPoint();
  console.log(`mouse position: ${JSON.stringify(mousePos)}`)
  return mousePos
}

const showWindow = (win, app) => {
  win.show();
  win.setAlwaysOnTop(true);
  if (win.isMaximized) {
    win.maximize();
  } else {
    win.showInactive()
  }

  win.setAlwaysOnTop(false)
  win.focus();
  app.focus({
    steal: true,
  });
};

const clickInBound = (point, bounds) => {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  )
};

// get actual position of window from mouse position (uses size of window and monitor information to calculate appropriate position)
const getWindowPosition = (mousePos, bounds, window) => {
  let x = mousePos.x;
  let y = mousePos.y;

  let cur_mon;
  for (const [value] of Object.entries(bounds)) {
    if (value.x <= x && x <= value.x1 && value.y <= y && y <= value.y1) {
      cur_mon = value;
      break;
    }
  }
  // just return the mouse coordinates if we don't have info on this monitor
  if (!cur_mon) {
    return { x: x, y: y };
  }

  const size_x = window.width;
  const size_y = window.height;

  if (x + size_x > cur_mon.x1) {
    x -= size_x;
  }

  if (y + size_y > cur_mon.y1) {
    y -= size_y;
  }

  return { x: x, y: y };
};

const changeIFrameURL = (win, text) => {
  win.webContents.send('change-iframe', {
    url: `https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic`,
    text: text,
  });
}

getMonitors = (app) => {
  return app.whenReady().then(() => {
    return screen.getAllDisplays();
  });
};

module.exports = {
  getWindowPosition: getWindowPosition,
  showWindow: showWindow,
  clickInBound: clickInBound,
  getMousePos: getMousePos,
  changeIFrameURL: changeIFrameURL,
  getMonitors: getMonitors,
};
