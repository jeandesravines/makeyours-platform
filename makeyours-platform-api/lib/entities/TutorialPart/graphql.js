import { gql } from 'apollo-server'

export default gql`
  ## Enums

  enum TutorialPartType {
    PART
    TOOL
  }

  ## Types

  type TutorialPart implements Document {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    tutorial: Tutorial!
    type: TutorialPartType!
    quantity: Float!
    name: String!
    url: String
  }
`
