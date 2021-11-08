export default {
  Query: {
    userGetMe(root, args, { user }) {
      return user
    }
  },
  User: {
    brands(root, args, { cache, context }) {
      return cache.BrandUser.findManyBy({ user: root._id }, args, context)
    },
    followers(root, args, { cache, context }) {
      return cache.UserFollower.findManySourceUsersBy({ target: root._id }, args, context)
    },
    following(root, args, { cache, context }) {
      return cache.UserFollower.findManyTargetUsersBy({ source: root._id }, args, context)
    },
    tutorials(root, args, { cache }) {
      return cache.Tutorial.paginate({ user: root._id }, args)
    }
  }
}
