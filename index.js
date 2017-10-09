const { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    firstName: String
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  firstName: () => 'Thibaut'
}

// Run the GraphQL query '{ firstName }' and print out the response
graphql(schema, '{ firstName }', root).then(res => console.log(res))
