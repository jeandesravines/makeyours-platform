import { gql } from 'apollo-server'

export default gql`
  ## Types

  type Session implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }
`
