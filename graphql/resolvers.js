const authResolver = require('./auth');

module.exports = {
  createUser: (args, req) => {
    return authResolver.createUser(args, req);
  },

  login: (args, req) => {
    return authResolver.login(args, req);
  },

  loadBooks: (args, req) => {
    return authResolver.loadBooks(args, req);
  },
};
