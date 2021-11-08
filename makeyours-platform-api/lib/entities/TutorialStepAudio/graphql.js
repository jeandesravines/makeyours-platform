import { gql } from 'apollo-server'

export default gql`
  ## Types

  type TutorialStepAudio implements Document & TutorialStep & TutorialStepMedia {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    type: TutorialStepType!
    name: String!
    description: String
    order: Int!
    time: Int
    peopleCount: Int
    parts: [TutorialPart!]!
    pictures: [TutorialStepPicture!]!
    url: String!
    duration: Int!
    coverUrl: String
  }
`
