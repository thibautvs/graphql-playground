const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const fakeDB = {}

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

class Message {
  constructor(id, { content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String!
    movies(id: Int): [String]
  }

  type Query {
    getUser(id: Int!): User
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  getUser: ({ id }) => new User(id),
  getMessage: ({ id }) => {
    if (!fakeDB[id]) {
      throw new Error(`No message exists with id ${id}`)
    }
    return new Message(id, fakeDB[id])
  },
  createMessage: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex')
    fakeDB[id] = input
    return new Message(id, input)
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDB[id]) {
      throw new Error(`No message exists with id ${id}`)
    }
    fakeDB[id] = input
    return new Message(id, input)
  }
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
