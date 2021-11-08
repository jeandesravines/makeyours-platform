import mongoose from 'mongoose'
import TutorialLikeService from './service'
import Model from '../Base/model'

const TutorialLikeSchema = new mongoose.Schema({
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

TutorialLikeSchema.loadClass(TutorialLikeService)
TutorialLikeSchema.index({ tutorial: 1, user: 1 }, { unique: true })
TutorialLikeSchema.index({ createdAt: -1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('TutorialLike', TutorialLikeSchema)
