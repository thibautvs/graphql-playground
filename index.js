const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

class User {
  constructor(id) {
    this.id = id
  }

  firstName() {
    return 'Thibaut'
  }

  lastName() {
    return 'Van Spaandonck'
  }

  movies({ id }) {
    const movies = ['The Matrix', 'Fight Club']
    if (id) {
      return [movies[id - 1]]
    }
    return movies
  }
}

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    movies(id: Int): [String]
  }

  type Query {
    getUser(id: Int!): User
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  getUser: ({ id }) => new User(id)
}

const app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
