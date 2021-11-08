export default {
  TutorialView: {
    user(root, args, { cache, context }) {
      return root.user && cache.User.findOneBy({ _id: root.user._id }, args, context)
    }
  }
}
