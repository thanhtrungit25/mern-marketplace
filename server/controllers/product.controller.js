import fs from 'fs'
import formidable from 'formidable'
import errorHandler from '../helpers/dbErrorHandler'
import Product from '../models/product.model'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
    let product = new Product(fields)
    product.shop = req.shop
    if (files.image) {
      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }

    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(fields)
  })
}

const listByShop = async (req, res) => {
  try {
    let products = await Product.find({shop: req.shop._id})
      .populate('shop', '_id name')
      .select('-image')
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id)
      .populate('shop', '_id name')
      .exec()
    if (!product) {
      return res.status(400).json({
        error: 'Product not found'
      })
    }
    req.product = product
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve product'
    })
  }
}

const image = async (req, res, next) => {
  if (req.product.image.data) {
    res.set('Content-Type', req.product.image.contentType)
    return res.send(req.product.image.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}

export default {
  create,
  listByShop,
  productByID,
  image,
  defaultPhoto,
}