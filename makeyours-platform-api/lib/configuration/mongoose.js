const debug = Number(process.env.MY_MONGODB_DEBUG) === 1

export default {
  debug,
  url: `${process.env.MY_MONGODB_URL}?retryWrites=true`,
  options: {
    autoIndex: debug,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
  }
}
