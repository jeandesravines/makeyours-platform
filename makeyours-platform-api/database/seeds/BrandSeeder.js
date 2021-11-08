import Brand from '../../lib/entities/Brand/model'
import Seeder from './Seeder'

/**
 * BrandSeeder
 */
export default class BrandSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return Brand.countBy({}).then(count => count === 0)
  }

  /**
   * Create many Brands
   * @returns {Promise<void>}
   */
  static async run() {
    const documents = Array.from({ length: 10 }, (v, i) => {
      const name = this.faker.company()

      return {
        name,
        username: `${name.replace(/\W/g, '.')}.${i}`,
        description: this.faker.sentence(),
        url: this.faker.url(),
        pictureUrl: this.faker.picture(),
        coverUrl: this.faker.picture()
      }
    })

    await Brand.saveMany(documents)
  }
}
