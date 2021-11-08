import mongoose from 'mongoose'
import TutorialCommentService from './service'
import Model from '../Base/model'

const TutorialCommentSchema = new mongoose.Schema({
  tutorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxLength: 1024,
    required: true
  }
})

TutorialCommentSchema.loadClass(TutorialCommentService)
TutorialCommentSchema.index({ tutorial: 1 })
TutorialCommentSchema.index({ user: 1 })
TutorialCommentSchema.index({ createdAt: -1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('TutorialComment', TutorialCommentSchema)
