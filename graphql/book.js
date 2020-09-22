const User = require('../models/user');
const Book = require('../models/book');
const Author = require('../models/author');
const Publisher = require('../models/publisher');

module.exports = {
  books: async (args, req) => {
    try {
      const books = await Book.findAll({
        include: [
          {
            model: Author,
          },
          {
            model: Publisher,
          },
        ],
      });
      return books;
    } catch (err) {
      const error = new Error(err);
      error.code = 500;
      throw error;
    }
  },
};
