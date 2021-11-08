import { gql } from 'apollo-server'

export default gql`
  ## Enums

  enum BrandUserAccess {
    RO
    RW
  }

  ## Types

  type BrandUser implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    brand: Brand!
    user: User!
    access: BrandUserAccess @isMe(key: "user")
  }
`
