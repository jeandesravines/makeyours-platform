import { Roles } from '../../lib/entities/User/constants'
import User from '../../lib/entities/User/model'
import Seeder from './Seeder'

/**
 * UserSeeder
 */
export default class UserSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return User.countBy({}).then(count => count === 0)
  }

  /**
   * Create many Users
   * @returns {Promise<void>}
   */
  static async run() {
    const adminCount = 2
    const documents = Array.from({ length: 20 }, (v, i) => {
      const username = i.toString().padStart(6, '0')

      return {
        username,
        uid: `local|${this.faker.guid()}`,
        name: this.faker.name(),
        email: `${username}@makeyours.com`,
        roles: [i < adminCount ? Roles.ADMIN : Roles.USER],
        pictureUrl: this.faker.picture(),
        coverUrl: this.faker.picture()
      }
    })

    await User.saveMany(documents)
  }
}
