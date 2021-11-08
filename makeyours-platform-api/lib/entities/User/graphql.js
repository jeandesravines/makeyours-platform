import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Query {
    userGetMe: User! @auth(required: true)
  }

  ## Directives

  directive @isMe(key: String = "id") on FIELD_DEFINITION

  ## Enums

  enum UserRole {
    ADMIN
    USER
  }

  ## Types

  type User implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    email: String @isMe
    name: String
    description: String
    coverUrl: String
    pictureUrl: String
    username: String!
    brands: [BrandUser!]!
    followers(offset: Int, limit: Int): UserPagination!
    following(offset: Int, limit: Int): UserPagination!
    roles: [UserRole!]!
    tutorials(offset: Int, limit: Int): TutorialPagination!
  }

  type UserPagination implements DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
    data: [User!]!
  }
`
