import mongoose from 'mongoose'
import UserFollowerService from './service'
import Model from '../Base/model'

const UserFollowerSchema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

UserFollowerSchema.loadClass(UserFollowerService)
UserFollowerSchema.index({ source: 1, target: 1 }, { unique: true })
UserFollowerSchema.index({ createdAt: -1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('UserFollower', UserFollowerSchema)
