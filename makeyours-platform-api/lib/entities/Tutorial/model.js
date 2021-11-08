import mongoose from 'mongoose'
import { Types, Difficulties } from './constants'
import TutorialService from './service'
import Model from '../Base/model'

const TutorialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  published: {
    type: Boolean,
    default: false,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(Types),
    default: Types.OTHER,
    required: true
  },
  difficulty: {
    type: String,
    enum: Object.values(Difficulties),
    default: Difficulties.EASY,
    required: true
  },
  preparationTime: {
    type: Number,
    min: 0
  },
  makingTime: {
    type: Number,
    min: 0
  },
  totalTime: {
    type: Number,
    min: 0
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
  pictureUrl: {
    type: String
  }
})

TutorialSchema.loadClass(TutorialService)
TutorialSchema.index({ brand: 1 })
TutorialSchema.index({ user: 1 })
TutorialSchema.index({ name: 'text', description: 'text' })
TutorialSchema.index({ published: 1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('Tutorial', TutorialSchema)
