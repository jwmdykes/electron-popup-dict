const { getMousePos, getText } = require('./python-shell');
const { getWindowPosition, showWindow } = require('./utils');
const { windowSize, getMonitors } = require('./settings');

let PreviousText = { text: '' };

const query = (win, app) => {
  getText((text) => {
    if (text.text !== '' && text.text !== PreviousText.text) {
      win.webContents.send('change-iframe', {
        url: 'https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic',
        text: text.text,
      });
    }
    PreviousText = text;
  });
  getMousePos((mousePos) => {
    // console.log(`MOUSEPOS: ${JSON.stringify(mousePos)}`)
    getMonitors(app)
      .then((mons) => {
        // console.log(JSON.stringify(mons))
        const bounds = [];
        for (const mon of mons) {
          mon.bounds.x1 = mon.bounds.x + mon.bounds.width;
          mon.bounds.y1 = mon.bounds.y + mon.bounds.height;
          bounds.push(mon.bounds);
        }
        return bounds;
      })
      .then((bounds) => {
        const winPos = getWindowPosition(mousePos, bounds, windowSize);
        return winPos;
      })
      .then((winPos) => {
        win.setPosition(winPos.x, winPos.y);
      })
      .then(() => {
        showWindow(win, app);
      });
  });
};

module.exports = {
  query: query,
};
