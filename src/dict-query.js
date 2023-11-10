const { getText } = require('./python-shell');

const query = () => {
  console.log('QUERYING');
  getText(); // callback is already setup
};

module.exports = {
  query: query,
};
