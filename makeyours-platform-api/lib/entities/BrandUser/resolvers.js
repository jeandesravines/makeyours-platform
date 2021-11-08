export default {
  BrandUser: {
    brand(root, args, { cache, context }) {
      return cache.Brand.findOneBy({ _id: root.brand._id }, args, context)
    },
    user(root, args, { cache, context }) {
      return cache.User.findOneBy({ _id: root.user._id }, args, context)
    }
  }
}
