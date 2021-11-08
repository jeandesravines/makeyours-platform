import BrandSeeder from './BrandSeeder'
import BrandUserSeeder from './BrandUserSeeder'
import TutorialPartSeeder from './TutorialPartSeeder'
import TutorialSeeder from './TutorialSeeder'
import TutorialStepSeeder from './TutorialStepSeeder'
import UserFollowerSeeder from './UserFollowerSeeder'
import UserSeeder from './UserSeeder'

/**
 * Ordered seeders
 * @const
 * @type {{
 *   shouldRun: function(): Promise<Boolean>,
 *   run: function(): Promise<void>
 * }}
 */
export default {
  BrandSeeder,
  UserSeeder,
  TutorialSeeder,
  TutorialPartSeeder,
  TutorialStepSeeder,
  BrandUserSeeder,
  UserFollowerSeeder
}
