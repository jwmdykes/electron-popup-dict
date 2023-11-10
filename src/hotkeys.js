const { globalShortcut } = require('electron');
const { query } = require('./dict-query');
const { getMousePos } = require('./utils')

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

  globalShortcut.register('CommandOrControl+T', () => {
    getMousePos();
  })

  // setMouseClickCallback(() => {
  //   query(win, app);
  // });
};

module.exports = {
  registerHotkeys: registerHotkeys,
};
