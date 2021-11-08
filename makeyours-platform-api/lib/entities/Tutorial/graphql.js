import { gql } from 'apollo-server'

export default gql`
  ## Enums

  enum TutorialDifficulty {
    EASY
    INTERMEDIATE
    HARD
  }

  ## Roots

  extend type Query {
    tutorialGetAll(offset: Int, limit: Int): TutorialPagination! @auth(required: true)
  }

  ## Types

  type Tutorial implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    brand: Brand
    name: String!
    published: Boolean!
    difficulty: TutorialDifficulty!
    description: String
    peopleCount: Int!
    pictureUrl: String
    preparationTime: Int
    makingTime: Int
    totalTime: Int
    mediaTime: Int!
    type: String!
    user: User!
    parts: [TutorialPart!]!
    steps: [TutorialStep!]!
    comments(offset: Int, limit: Int): TutorialCommentPagination!
    likes(offset: Int, limit: Int): TutorialLikePagination!
    views(offset: Int, limit: Int): TutorialViewPagination!
  }

  type TutorialPagination implements DocumentPagination {
    offset: Int!
    limit: Int!
    total: Int!
    data: [Tutorial!]!
  }
`
