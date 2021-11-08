import { gql } from 'apollo-server'

export default gql`
  ## Types

  type TutorialView implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  type TutorialViewPagination implements DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
    data: [TutorialView!]!
  }
`
