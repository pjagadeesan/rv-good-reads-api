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
        authors: [Author!]!
        publisher: Publisher
    }

    type Author{
        id: ID!
        name: String!
    }
    type Publisher{
        id: ID!
        name: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }
     input UserInputData {
         email: String!
         name: String!
         password: String!
     }

     type AuthData {
        userId: String!
        token: String!
    }

    type RootQuery {
        login(email: String!, password:String!): AuthData!
        books: [Book!]!
    }

    type RootMutation{
        createUser(userInput: UserInputData) : User!
        loadBooks(author: String!): [Book!]!
        
    }

    schema {      
        query: RootQuery
        mutation: RootMutation
    }
`);
