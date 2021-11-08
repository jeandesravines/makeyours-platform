import * as configuration from '../../configuration'
import Service from '../Base/service'
import BrandUser from '../BrandUser/model'
import Session from '../Session/model'
import Tutorial from '../Tutorial/model'
import TutorialComment from '../TutorialComment/model'
import TutorialLike from '../TutorialLike/model'
import TutorialView from '../TutorialView/model'
import UserFollower from '../UserFollower/model'

/**
 * UserService
 * @extends {Service<User>}
 */
export default class UserService extends Service {
  /**
   * Post-Remove hook
   * @protected
   * @param {User} document
   * @returns {Promise<void>}
   */
  static async onPostDelete(document) {
    await Promise.all([
      BrandUser.deleteManyBy({ user: document._id }),
      Session.deleteManyBy({ user: document._id }),
      Tutorial.deleteManyBy({ user: document._id }),
      TutorialComment.deleteManyBy({ user: document._id }),
      TutorialLike.deleteManyBy({ user: document._id }),
      TutorialView.deleteManyBy({ user: document._id }),
      UserFollower.deleteManyBy({ source: document._id }),
      UserFollower.deleteManyBy({ target: document._id })
    ])
  }

  /**
   * Returns true if the User owe the given role
   * @param {String} role
   * @returns {Boolean}
   */
  hasRole(role) {
    return this.roles.some(key => configuration.user.roles[key].includes(role))
  }
}
