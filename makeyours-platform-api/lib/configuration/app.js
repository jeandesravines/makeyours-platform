const environment = process.env.NODE_ENV || 'development'

export default {
  isProduction: environment === 'production',
  url: process.env.MY_APP_URL
}
