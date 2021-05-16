import fs from 'fs'
import formidable from 'formidable'
import Shop from '../models/shop.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
    let shop = new Shop(fields)
    shop.owner = req.profile
    try {
      if (files.image) {
        shop.image.data = fs.readFileSync(files.image.path)
        shop.image.contentType = files.image.type
      }
      let result = await shop.save()
      result.owner.hashed_password = undefined
      result.owner.salt = undefined
      res.status(200).json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

export default {
  create,
}