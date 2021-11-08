import Brand from '../../lib/entities/Brand/model'
import BrandUser from '../../lib/entities/BrandUser/model'
import User from '../../lib/entities/User/model'
import { Accesses } from '../../lib/entities/BrandUser/constants'
import Seeder from './Seeder'

/**
 * BrandUserSeeder
 */
export default class BrandUserSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return BrandUser.countBy({}).then(count => count === 0)
  }

  /**
   * Create 2 Brands per Users
   * @returns {Promise<void>}
   */
  static async run() {
    const brands = await Brand.findManyBy({})
    const users = await User.findManyBy({})
    const [brandRO, brandRW] = this.faker.pickset(brands, 2)
    const documents = users.flatMap(user => [
      {
        brand: brandRO._id,
        user: user._id,
        access: Accesses.RO
      },
      {
        brand: brandRW._id,
        user: user._id,
        access: Accesses.RW
      }
    ])

    await BrandUser.saveMany(documents)
  }
}
