const validator = require('validator');
const { response } = require('express');
const fetch = require('node-fetch');

const Book = require('../models/book');
const Author = require('../models/author');
const Publisher = require('../models/publisher');

const API_KEY = '';
const url = 'https://www.googleapis.com/books/v1/volumes?q=';

module.exports = {
  loadBooks: async ({ author }, req) => {
    if (validator.isEmpty(author)) {
      const error = new Error('Invalid input');
      //error.data = errors;
      error.code = 422;
      throw error;
    }
    //find author already exist in database
    const dbAuthor = await Author.findOne({ where: { name: author } });
    if (dbAuthor) {
      const error = new Error('Author already exist');
      //error.data = errors;
      error.code = 422;
      throw error;
    }

    const queryAuthor = author.replace(' ', '+');
    const maxResults = 2;
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
          categories: book.volumeInfo.categories,
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
    //find all books by athor and return
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
  },
};

const createAuthors = async (book, authors) => {
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
};

const createPublisher = async (book, publisher) => {
  let bookPublisher = await Publisher.findOne({ where: { name: publisher } });
  if (!bookPublisher) {
    bookPublisher = await Publisher.create({
      name: publisher,
    });
  }
  await book.addPublisher(bookPublisher);
};
