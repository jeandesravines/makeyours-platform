import _ from 'lodash'
import { Roles } from '../entities/User/constants'

// Ordered roles
const roles = {
  [Roles.USER]: [],
  [Roles.ADMIN]: [Roles.USER]
}

// Give each roles the privileges of the previous
_.forEach(roles, (dependencies, key) => {
  roles[key] = dependencies.reduce((acc, role) => [...acc, ...roles[role]], [key])
})

export default {
  roles
}
