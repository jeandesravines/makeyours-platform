import { defaultFieldResolver, GraphQLNonNull } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import ForbiddenError from '../errors/common/ForbiddenError'
import UnauthorizedError from '../errors/common/UnauthorizedError'
import { ErrorCodes } from '../entities/Auth/constants'

/**
 * Visit a GraphQLField to act according to the User's role
 */
export default class AuthDirective extends SchemaDirectiveVisitor {
  /**
   * Visitor for a Field definition
   * @override
   * @param {GraphQLField} field
   * @returns {void}
   */
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { required, role } = this.args
    const target = field
    const { name, type } = field

    if (!required && field.type instanceof GraphQLNonNull) {
      throw new Error(
        `@auth(required: false) cannot be applied on the non-nullable field: "${name}: ${type}"`
      )
    }

    target.resolve = (...args) => {
      const user = args[2].user
      const hasRole = role ? user?.hasRole(role) : true

      if (required) {
        if (!user) {
          throw new UnauthorizedError(ErrorCodes.UNAUTHORIZED)
        }

        if (!hasRole) {
          throw new ForbiddenError(ErrorCodes.FORBIDDEN, { role })
        }
      }

      return hasRole ? resolve(...args) : null
    }
  }
}
