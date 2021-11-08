export default {
  Brand: {
    users(root, args, { cache, context }) {
      return cache.BrandUser.findManyBy({ brand: root._id }, args, context)
    }
  }
}
