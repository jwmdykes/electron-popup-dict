const { getMousePos, getText } = require('./python-shell');

const query = (win, app) => {
  console.log('QUERYING');
  getText(); // callback is already setup
};

module.exports = {
  query: query,
};
