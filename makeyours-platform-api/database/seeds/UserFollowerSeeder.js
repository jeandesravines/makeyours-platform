import User from '../../lib/entities/User/model'
import UserFollower from '../../lib/entities/UserFollower/model'
import Seeder from './Seeder'

/**
 * UserFollowerSeeder
 */
export default class UserFollowerSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return UserFollower.countBy({}).then(count => count === 0)
  }

  /**
   * Create 2 UserFollowers per User
   * @returns {Promise<void>}
   */
  static async run() {
    const users = await User.findManyBy({})
    const documents = users.flatMap(user =>
      this.faker
        .pickset(users, this.faker.natural({ max: 3 }))
        .map(target => ({ source: user._id, target: target._id }))
    )

    await UserFollower.saveMany(documents)
  }
}
