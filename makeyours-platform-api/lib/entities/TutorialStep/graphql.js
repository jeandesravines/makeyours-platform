import { gql } from 'apollo-server'

export default gql`
  ## Enums

  enum TutorialStepType {
    AUDIO
    TEXT
  }

  ## Types

  interface TutorialStep {
    type: TutorialStepType!
    name: String!
    description: String
    order: Int!
    time: Int
    peopleCount: Int
    parts: [TutorialPart!]!
    pictures: [TutorialStepPicture!]!
  }

  interface TutorialStepMedia {
    url: String!
    duration: Int!
    coverUrl: String
  }

  type TutorialStepPicture implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String
    url: String!
  }
`
