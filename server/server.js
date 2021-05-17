import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import loadEmojis from './helpers/emojis'

loadEmojis()
// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.unicorn(`Server started on port ${config.port}.`)
})
