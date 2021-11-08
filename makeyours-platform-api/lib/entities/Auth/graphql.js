import { gql } from 'apollo-server'

export default gql`
  ## Directives

  directive @auth(required: Boolean = false, role: UserRole) on FIELD_DEFINITION

  ## Roots

  extend type Query {
    authGetToken(username: String!, password: String!): Token!
  }

  ## Types

  type Token {
    token: String!
    expiresIn: Int!
  }
`
