const {screen} = require('electron')

getMonitors = (app) => {
  return app.whenReady().then(() => {
    return screen.getAllDisplays();
  });
};

module.exports = {
  windowSize: {
    width: 500,
    height: 550,
  },
  getMonitors: getMonitors,
};
