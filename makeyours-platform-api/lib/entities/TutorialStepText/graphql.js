import { gql } from 'apollo-server'

export default gql`
  ## Types

  type TutorialStepText implements Document & TutorialStep {
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
  }
`
