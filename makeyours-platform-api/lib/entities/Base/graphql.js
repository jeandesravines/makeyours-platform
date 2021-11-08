import { gql } from 'apollo-server'

export default gql`
  ## Roots

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  ## Scalars

  scalar DateTime
`
