import mongoose from 'mongoose'
import TutorialStep from '../TutorialStep/model'
import { Types } from '../TutorialStep/constants'

const TutorialStepTextSchema = new mongoose.Schema({})

/**
 * @const {mongoose.Model}
 */
export default TutorialStep.discriminator('TutorialStepText', TutorialStepTextSchema, Types.TEXT)
