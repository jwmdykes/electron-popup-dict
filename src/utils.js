// show window helper to fix windows 10 issues with focus
const showWindow = (win, app) => {
  win.show();
  win.setAlwaysOnTop(true);
  if (win.isMaximized) {
    win.mainWindow?.maximize();
  } else {
    win.mainWindow?.showInactive();
  }

  win.mainWindow?.setAlwaysOnTop(false);
  win.mainWindow?.focus();
  app.focus({
    steal: true,
  });
};

const clickInBound = (point, bounds) => {
  if (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  ) {
    return true;
  } else {
    return false;
  }
};

// get actual position of window from mouse position (uses size of window and monitor information to calculate appropriate position)
const getWindowPosition = (mousePos, bounds, window) => {
  x = mousePos.x;
  y = mousePos.y;

  let cur_mon;
  for (const [key, value] of Object.entries(bounds)) {
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

module.exports = {
  getWindowPosition: getWindowPosition,
  showWindow: showWindow,
  clickInBound: clickInBound,
};
