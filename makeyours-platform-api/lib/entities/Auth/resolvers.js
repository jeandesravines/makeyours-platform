import Auth from './service'

export default {
  Query: {
    authGetToken(root, args) {
      return Auth.getAccessToken(args)
    }
  }
}
