const { getMousePos, getText } = require('./python-shell');

const query = (win, app) => {
  getText(); // callback is already setup
};

module.exports = {
  query: query,
};
