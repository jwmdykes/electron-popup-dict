const { globalShortcut } = require('electron');
const { query } = require('./dict-query');
const { setMouseClickCallback, getMousePos } = require('./python-shell');

const registerHotkeys = (win, app) => {
  globalShortcut.register('esc', () => {
    // console.log("esc")
    // app.quit();
  });

  globalShortcut.register('CommandOrControl+D', () => {
    // console.log("ctrl+d")
    query(win, app);
    win.webContents.send('focus-search');
  });

  // setMouseClickCallback(() => {
  //   query(win, app);
  // });
};

module.exports = {
  registerHotkeys: registerHotkeys,
};
