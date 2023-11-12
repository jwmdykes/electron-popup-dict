// show window helper to fix Windows 10 issues with focus
const { screen, clipboard, globalShortcut} = require('electron')
const {windowSize} = require("./settings");
const settings = require("./settings");

function getMousePos() {
  return screen.getCursorScreenPoint()
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

const getSelectedText = () => {
  return clipboard.readText('selection');
}

getMonitors = (app) => {
  return app.whenReady().then(() => {
    return screen.getAllDisplays();
  });
};

const MoveWindowToCursor = async (win, app, mousePos) => {
  const mons = await getMonitors(app)

  const bounds = [];
  for (const mon of mons) {
    mon.bounds.x1 = mon.bounds.x + mon.bounds.width;
    mon.bounds.y1 = mon.bounds.y + mon.bounds.height;
    bounds.push(mon.bounds);
  }

  const winPos = getWindowPosition(mousePos, bounds, windowSize);

  win.setPosition(winPos.x, winPos.y);
}

const dictQuery = async (win, browserView, app, text) => {
  const mousePos = getMousePos()
  await MoveWindowToCursor(win, app, mousePos)
  showWindow(win, app)

  if (text !== '') {
    await changeWebView(win, browserView, text)
  }
};

const registerHotkeys = (win, browserView, app) => {
  globalShortcut.register('CommandOrControl+D', async () => {
    const selectedText = getSelectedText();
    console.log(selectedText)
    await dictQuery(win, browserView, app, selectedText);
    win.webContents.send('focus-search');
  });

  globalShortcut.register('CommandOrControl+T', () => {
    const selectedText = getSelectedText();
    console.log(`selected text: ${selectedText}`);
  })
};

const changeWebView = async (win, browserView, text) => {
  // win.removeBrowserView(browserView)

  let url = settings.queryURL;
  text = encodeURIComponent(text);
  url = url.replace('<<word>>', text);

  await browserView.webContents.loadURL(url);

  // await browserView.webContents.executeJavaScript(`
  //     document.head.innerHTML += \`${settings.css}\`
  //   `);

  // win.addBrowserView(browserView)
}

module.exports = {
    registerHotkeys: registerHotkeys,
    changeWebView: changeWebView,
};
