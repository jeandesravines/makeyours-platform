import _ from 'lodash'
import * as configuration from './lib/configuration'

const backup = _.cloneDeep(configuration)

beforeEach(() => {
  Object.assign(configuration, _.cloneDeep(backup))
})
