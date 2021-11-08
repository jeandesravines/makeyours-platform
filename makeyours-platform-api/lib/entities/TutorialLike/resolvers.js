export default {
  TutorialLike: {
    user(root, args, { cache, context }) {
      return cache.User.findOneBy({ _id: root.user._id }, args, context)
    }
  }
}
