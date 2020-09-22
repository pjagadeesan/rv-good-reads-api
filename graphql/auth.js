const validator = require('validator');
const { response } = require('express');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Book = require('../models/book');
const Author = require('../models/author');
const Publisher = require('../models/publisher');

const API_KEY = '';
const url = 'https://www.googleapis.com/books/v1/volumes?q=';

module.exports = {
  createUser: async ({ userInput }, req) => {
    const { email, name, password } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail is invalid.' });
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        const error = new Error('Email exists already!');
        throw error;
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({ email, password: hashedPassword, name });
      return newUser;
    } catch (err) {
      console.error(err);
      const error = new Error(err);
      error.code = 500;
      throw error;
    }
  },

  login: async ({ email, password }, req) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error('Email does not exist');
        error.code = 401;
        //error.data = errors.array();
        throw error;
      }

      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        const error = new Error('Incorrect password');
        error.code = 401;
        throw error;
      }
      //generate JWT -JSON web token
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id,
        },
        'mysupersecret',
        { expiresIn: '1h' }
      );

      return {
        token,
        userId: user.id,
      };
    } catch (err) {
      const error = new Error(err);
      error.code = err.code ? err.code : 500;
      throw error;
    }
  },

  loadBooks: async ({ author }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticaetd!');
      error.code = 401;
      throw error;
    }
    if (validator.isEmpty(author)) {
      const error = new Error('Invalid input');
      //error.data = errors;
      error.code = 422;
      throw error;
    }
    try {
      //find author already exist in database
      const existingAuthor = await Author.findOne({ where: { name: author } });
      if (existingAuthor) {
        const error = new Error('Author already exist');
        //error.data = errors;
        error.code = 422;
        throw error;
      }

      const queryAuthor = author.replace(' ', '+');
      const maxResults = 5;
      const response = await fetch(
        `${url}inauthor:${queryAuthor}&maxResults=${maxResults}&key=${API_KEY}`
      );
      const volumes = await response.json();
      let publisher;
      if (volumes.totalItems > 0) {
        const books = volumes.items;
        for (const book of books) {
          const authors = book.volumeInfo.authors;
          const newBook = await Book.create({
            bookId: book.id,
            title: book.volumeInfo.title,
            categories: 'categories' in book.volumeInfo ? book.volumeInfo.categories : [],
            averageRating: book.volumeInfo.averageRating,
            printType: book.volumeInfo.printType,
            language: book.volumeInfo.language,
            publishedDate: book.volumeInfo.publishedDate,
            description: book.volumeInfo.description,
          });
          await createAuthors(newBook, authors);

          publisher = book.volumeInfo.publisher;
          if (publisher !== undefined) {
            await createPublisher(newBook, publisher);
          }
        }
      }
      //find all books by author and return
      const books = await Book.findAll({
        include: [
          {
            model: Author,
            where: { name: author },
          },
          {
            model: Publisher,
          },
        ],
      });
      return books;
    } catch (err) {
      const error = new Error(err);
      error.code = err.code ? err.code : 500;
      throw error;
    }
  },
};

const createAuthors = async (book, authors) => {
  try {
    for (const author of authors) {
      const existingAuthor = await Author.findOne({ where: { name: author } });
      if (!existingAuthor) {
        const newAuthor = await Author.create({
          name: author,
        });
        await book.addAuthor(newAuthor);
      }
      await book.addAuthor(existingAuthor);
    }
  } catch (err) {
    const error = new Error(err);
    error.code = 500;
    throw error;
  }
};

const createPublisher = async (book, publisher) => {
  try {
    let bookPublisher = await Publisher.findOne({ where: { name: publisher } });
    if (!bookPublisher) {
      bookPublisher = await Publisher.create({
        name: publisher,
      });
    }
    await book.setPublisher(bookPublisher);
  } catch (err) {
    const error = new Error(err);
    error.code = 500;
    throw error;
  }
};
