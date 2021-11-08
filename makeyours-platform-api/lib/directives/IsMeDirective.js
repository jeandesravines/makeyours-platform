import _ from 'lodash'
import { defaultFieldResolver, GraphQLNonNull } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

/**
 * Visit a GraphQLField to check if one of its parents is the current user
 */
export default class IsMeDirective extends SchemaDirectiveVisitor {
  /**
   * Visitor for a Field definition
   * @override
   * @param {GraphQLField} field
   * @returns {void}
   */
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { key } = this.args
    const target = field
    const { type, name } = field

    if (field.type instanceof GraphQLNonNull) {
      throw new Error(`@isMe cannot be applied on the non-nullable field: "${name}: ${type}"`)
    }

    target.resolve = (...args) => {
      const root = args[0]
      const user = args[2].user
      const isAllowed = user && _.get(root, key) === user.id

      return isAllowed ? resolve(...args) : null
    }
  }
}
