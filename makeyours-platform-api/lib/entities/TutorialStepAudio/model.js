import mongoose from 'mongoose'
import TutorialStep from '../TutorialStep/model'
import { Types } from '../TutorialStep/constants'

const TutorialStepAudioSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    min: 0
  },
  coverUrl: {
    type: String
  }
})

/**
 * @const {mongoose.Model}
 */
export default TutorialStep.discriminator('TutorialStepAudio', TutorialStepAudioSchema, Types.AUDIO)
