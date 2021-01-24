import serverless from 'serverless-http'
import app from './root'

module.exports.handler = serverless(app)