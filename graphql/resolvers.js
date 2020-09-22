const authResolver = require('./auth');
const bookResolver = require('./book');

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
  books: (args, req) => {
    return bookResolver.books(args, req);
  },
};
