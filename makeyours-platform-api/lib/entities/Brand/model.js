import mongoose from 'mongoose'
import BrandService from './service'
import Model from '../Base/model'

const BrandSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String
  },
  pictureUrl: {
    type: String
  }
})

BrandSchema.loadClass(BrandService)
BrandSchema.index({ username: 1 }, { unique: true })
BrandSchema.index({ username: 'text', name: 'text', description: 'text', url: 'text' })

/**
 * @const {mongoose.Model}
 */
export default Model.create('Brand', BrandSchema)
