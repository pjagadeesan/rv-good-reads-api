const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  bookId: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categories: {
    type: Sequelize.STRING,
    set(val) {
      this.setDataValue('categories', val.join(','));
    },
  },
  averageRating: {
    type: Sequelize.DECIMAL,
  },
  printType: {
    type: Sequelize.STRING,
  },
  language: {
    type: Sequelize.STRING,
  },
  publishedDate: {
    type: Sequelize.DATEONLY,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Book;
