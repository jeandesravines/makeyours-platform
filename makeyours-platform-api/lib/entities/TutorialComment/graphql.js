import { gql } from 'apollo-server'

export default gql`
  ## Types

  type TutorialComment implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    message: String!
  }

  type TutorialCommentPagination implements DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
    data: [TutorialComment!]!
  }
`
