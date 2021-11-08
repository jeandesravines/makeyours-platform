import Tutorial from './model'

export default {
  Query: {
    tutorialGetAll(root, args) {
      return Tutorial.paginate({ published: true }, args)
    }
  },
  Tutorial: {
    brand(root, args, { cache, context }) {
      return root.brand && cache.Brand.findOneBy({ _id: root.brand._id }, args, context)
    },
    comments(root, args, { cache }) {
      return cache.TutorialComment.paginate({ tutorial: root._id }, args)
    },
    likes(root, args, { cache }) {
      return cache.TutorialLike.paginate({ tutorial: root._id }, args)
    },
    views(root, args, { cache }) {
      return cache.TutorialView.paginate({ tutorial: root._id }, args)
    },
    peopleCount(root, args, { cache, context }) {
      return cache.Tutorial.findPeopleCountByTutorial({ tutorial: root }, args, context)
    },
    parts(root, args, { cache, context }) {
      return cache.TutorialPart.findManyBy({ tutorial: root._id }, args, context)
    },
    steps(root, args, { cache, context }) {
      return cache.Tutorial.findStepsByTutorial({ tutorial: root._id }, args, context)
    },
    mediaTime(root, args, { cache, context }) {
      return cache.Tutorial.findMediaTimeByTutorial({ tutorial: root }, args, context)
    },
    user(root, args, { cache, context }) {
      return cache.User.findOneBy({ _id: root.user._id }, args, context)
    }
  }
}
