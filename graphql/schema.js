const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Book{
        id: ID!
        title: String!
        categories: String!
        averageRating: Float!
        printType: String!
        language: String!
        publishedDate: String!
        description: String!   
    }

    type RootQuery {
        status: String!
    }

    type RootMutation{
        loadBooks(author: String!): [Book!]!
    }

    schema {      
        query: RootQuery
        mutation: RootMutation
    }
`);
