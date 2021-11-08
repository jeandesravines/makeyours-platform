import mongoose from 'mongoose'
import { Types } from './constants'
import TutorialPartService from './service'
import Model from '../Base/model'

const TutorialPartSchema = new mongoose.Schema({
  tutorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(Types),
    required: true
  },
  order: {
    type: Number,
    min: 0,
    required: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  },
  name: {
    type: String,
    maxLength: 1024,
    required: true
  },
  url: {
    type: String
  }
})

TutorialPartSchema.loadClass(TutorialPartService)
TutorialPartSchema.index({ tutorial: 1 })
TutorialPartSchema.index({ order: 1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('TutorialPart', TutorialPartSchema)
