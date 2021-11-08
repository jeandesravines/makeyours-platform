import { gql } from 'apollo-server'

export default gql`
  ## Types

  type TutorialLike implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  type TutorialLikePagination implements DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
    data: [TutorialLike!]!
  }
`
