import mongoose from 'mongoose'
import TutorialViewService from './service'
import Model from '../Base/model'

const TutorialViewSchema = new mongoose.Schema({
  tutorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

TutorialViewSchema.loadClass(TutorialViewService)
TutorialViewSchema.index({ tutorial: 1, user: 1 }, { unique: true })

/**
 * @const {mongoose.Model}
 */
export default Model.create('TutorialView', TutorialViewSchema)
