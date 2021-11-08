import Service from '../Base/service'
import BrandUser from '../BrandUser/model'
import Tutorial from '../Tutorial/model'

/**
 * BrandService
 * @extends {Service<Brand>}
 */
export default class BrandService extends Service {
  /**
   * Post-Remove hook
   * @protected
   * @param {Brand} document
   * @returns {Promise<void>}
   */
  static async onPostDelete(document) {
    await Promise.all([
      Tutorial.deleteManyBy({ brand: document._id }),
      BrandUser.deleteManyBy({ brand: document._id })
    ])
  }
}
