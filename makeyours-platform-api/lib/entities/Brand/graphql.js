import { gql } from 'apollo-server'

export default gql`
  ## Types

  type Brand implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    description: String
    name: String!
    coverUrl: String
    pictureUrl: String
    url: String!
    users: [BrandUser!]!
  }
`
