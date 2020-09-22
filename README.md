# RV Good Reads API

### Description

A GraphQL API for loading books from Google Books API using Node.js and express-graphql.
This API accepts accepts an author name from an authenticated user and load data of all books written by the author in to MySQL database.

### Features

- GraphQL API
- Automatic model mapping through Sequelize
- Persistance for Books, Authors, Publishers and their relations using Sequelize and MySQL

### Prerequisites

1. Node.js and npm
2. nodemon
3. MySQL

### Install and start the application

```
    $ git clone https://github.com/pjagadeesan/rv-good-reads-api.git
    $ cd rv-good-reads-api
    $ npm install
    $ npm start
```

## Explore and test the API using the following graphiql UI

```
http://localhost:8080/graphql
```

### coming up next

- add root queries to load all books and books written by the author
- add mutation to bulk load data from Google Books API for multiple authors

# Books API - Requirements

V1: Create a Node API with an endpoint that allows an authenticated admin user to send an author to the endpoint, which will then pull books from the Google Books API by that particular author. Get the response, transform the data and insert into MySQL database that has separate table for the following:

- books
- booksauthors (connects books and authors)
- authors
- bookpublishers (connects books and publishers)
- publishers
  V2: create a second endpoint that accepts a list of authors instead of a single one and search for them all at once.
