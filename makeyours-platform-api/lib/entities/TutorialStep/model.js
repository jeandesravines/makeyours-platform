import mongoose from 'mongoose'
import TutorialStepService from './service'
import { Types } from './constants'
import Model from '../Base/model'

const TutorialStepPictureSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 1024
  },
  url: {
    type: String,
    required: true
  }
})

const TutorialStepSchema = new mongoose.Schema({
  tutorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(Types),
    default: Types.TEXT,
    required: true
  },
  order: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  },
  name: {
    type: String,
    maxLength: 1024,
    required: true
  },
  description: {
    type: String,
    maxLength: 1024
  },
  time: {
    type: Number,
    min: 0
  },
  peopleCount: {
    type: Number,
    min: 1,
    default: 1
  },
  parts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TutorialPart' }],
    required: true
  },
  pictures: {
    type: [TutorialStepPictureSchema],
    required: true
  }
})

TutorialStepSchema.loadClass(TutorialStepService)
TutorialStepSchema.set('discriminatorKey', 'type')
TutorialStepSchema.index({ tutorial: 1 })
TutorialStepSchema.index({ order: 1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('TutorialStep', TutorialStepSchema)
