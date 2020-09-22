const authResolver = require('./auth');

module.exports = {
  loadBooks: (args, req) => {
    return authResolver.loadBooks(args, req);
  },
};
