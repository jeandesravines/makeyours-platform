import mongoose from 'mongoose'
import BrandUserService from './service'
import { Accesses } from './constants'
import Model from '../Base/model'

const BrandUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  access: {
    type: String,
    enum: Object.values(Accesses),
    default: Accesses.ro,
    required: true
  }
})

BrandUserSchema.loadClass(BrandUserService)
BrandUserSchema.index({ brand: 1, user: 1 }, { unique: true })

/**
 * @const {mongoose.Model}
 */
export default Model.create('BrandUser', BrandUserSchema)
