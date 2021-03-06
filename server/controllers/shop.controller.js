import fs from 'fs'
import formidable from 'formidable'
import Shop from '../models/shop.model'
import errorHandler from '../helpers/dbErrorHandler'
import defaultImage from '../../client/assets/images/default.png'
import { extend } from 'lodash'

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

const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id)
      .populate('owner', '_id name')
      .exec()
    if (!shop) {
      return res.status(400).json({
        error: 'Shop not found'
      })
    }
    req.shop = shop
    next()
  } catch (error) {
    return res.status(400).json({
      error: 'Could not retrieve a shop'
    })
  }
}

const photo = (req, res, next) => {
  if (req.shop.image.data) {
    res.set('Content-Type', req.shop.image.contentType)
    return res.send(req.shop.image.data)
  }
  next()
}

const defaultPhoto = (req, res, next) => {
  res.sendFile(process.cwd()+defaultImage)
}

const list = async (req, res, next) => {
  try {
    let shops = await Shop.find()
    res.json(shops)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByOwner = async (req, res, next) => {
  try {
    let shops = await Shop.find({ owner: req.profile._id })
      .populate('owner', '_id name')
    res.json(shops)
  } catch (err) {
    console.log('????', err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  req.shop.image = undefined
  return res.json(req.shop)
}

const isOwner = (req, res, next) => {
  const isOwner = req.auth && req.shop
                           && req.auth._id == req.shop.owner._id
  if (!isOwner) {
    return res.status(403).json({
      error: 'User is not authorized'
    })
  }
  next()
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    let shop = req.shop
    shop = extend(shop, fields)
    shop.updated = Date.now()

    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path)
      shop.image.contentType = files.image.type
    }

    try {
      let result = await shop.save()
      res.json(result)
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let shop = req.shop
    let deletedShop = await shop.remove()
    res.json(deletedShop)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

export default {
  create,
  shopByID,
  photo,
  defaultPhoto,
  list,
  listByOwner,
  read,
  isOwner,
  update,
  remove,
}
