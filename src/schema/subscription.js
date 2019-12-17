const { gql } = require('apollo-server');

const typeDefs = gql`
type Subscription {
    requestSent: Request
}

type Request {
    id: ID!
    sender: User!
    recipient: User!
}
`

module.exports = typeDefs;