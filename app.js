const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

const sequelize = require('./util/database');
const Book = require('./models/book');
const Author = require('./models/author');
const Publisher = require('./models/publisher');
const auth = require('./middleware/auth');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();
//To enable Cross origin read sharing using 'cors' package
app.use(cors());
//configure body-parser for parsing JSON data
app.use(bodyParser.json()); //application/json

//use auth middleware here
app.use(auth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      console.log(err);
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occured.';
      const code = err.originalError.code;
      return { message, status: code, data };
    },
  })
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode).json({ message: error.message });
});

//define Book, Author, Publisher realtions
Book.belongsToMany(Author, { through: 'booksauthors' });
Author.belongsToMany(Book, { through: 'booksauthors' });
Book.hasOne(Publisher, { through: 'bookspublishers' });
Publisher.belongsToMany(Book, { through: 'bookspublishers' });

sequelize
  .sync({ force: true })
  //.sync()
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
