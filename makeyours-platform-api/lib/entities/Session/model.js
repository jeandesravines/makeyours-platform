import mongoose from 'mongoose'
import * as configuration from '../../configuration'
import SessionService from './service'
import Model from '../Base/model'

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

SessionSchema.loadClass(SessionService)
SessionSchema.index({ createdAt: -1 }, { expires: configuration.session.ttl })
SessionSchema.index({ user: 1 })

/**
 * @const {mongoose.Model}
 */
export default Model.create('Session', SessionSchema)
