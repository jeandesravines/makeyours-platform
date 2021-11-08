import mongoose from 'mongoose'
import { Roles } from './constants'
import UserService from './service'
import Model from '../Base/model'

const UserRoleSchema = {
  type: String,
  enum: Object.values(Roles),
  required: true
}

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  email: {
    type: String,
    maxLength: 1024,
    required: true
  },
  username: {
    type: String,
    maxLength: 1024,
    required: true
  },
  name: {
    type: String,
    maxLength: 1024
  },
  description: {
    type: String,
    maxLength: 2048
  },
  coverUrl: {
    type: String
  },
  pictureUrl: {
    type: String
  },
  roles: {
    type: [UserRoleSchema],
    default: [Roles.USER],
    minLength: 1,
    required: true
  }
})

UserSchema.loadClass(UserService)
UserSchema.index({ uid: 1 }, { unique: true })
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 'text' }, { unique: true })
UserSchema.index({ username: 'text', name: 'text' })

/**
 * @const {mongoose.Model}
 */
export default Model.create('User', UserSchema)
