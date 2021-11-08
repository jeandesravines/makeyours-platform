import _ from 'lodash'
import Auth from './Auth/resolvers'
import Brand from './Brand/resolvers'
import BrandUser from './BrandUser/resolvers'
import Document from './Document/resolvers'
import Session from './Session/resolvers'
import Tutorial from './Tutorial/resolvers'
import TutorialComment from './TutorialComment/resolvers'
import TutorialLike from './TutorialLike/resolvers'
import TutorialPart from './TutorialPart/resolvers'
import TutorialStep from './TutorialStep/resolvers'
import TutorialView from './TutorialView/resolvers'
import User from './User/resolvers'

export default _.merge(
  Auth,
  Brand,
  BrandUser,
  Document,
  Session,
  Tutorial,
  TutorialComment,
  TutorialLike,
  TutorialPart,
  TutorialStep,
  TutorialView,
  User
)
