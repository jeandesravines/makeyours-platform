import { gql } from 'apollo-server'

export default gql`
  ## Types

  interface Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  interface DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
  }
`
