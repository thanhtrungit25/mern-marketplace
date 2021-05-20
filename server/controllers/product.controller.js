import fs from 'fs'
import formidable from 'formidable'
import errorHandler from '../helpers/dbErrorHandler'
import Product from '../models/product.model'
import defaultImage from './../../client/assets/images/default.png'
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

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
    let product = req.product
    product = extend(product, fields)
    product.updated = Date.now()

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
  })
}

const remove = async (req, res) => {
  try {
    let product = req.product
    let deletedProduct = await product.remove()
    res.json(deletedProduct)
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve product'
    })
  }
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

const listLatest = async (req, res) => {
  try {
    let products = await Product.find({}).sort('-created')
      .limit(5)
      .populate('shop', '_id name')
      .exec()
    return res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listRelated = async (req, res) => {
  try {
    let products = await Product.find({
      "_id": { "$ne": req.product },
      "category": req.product.category
    })
      .limit(5)
      .populate('shop', '_id name')
      .exec()
    return res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listCategories = async (req, res) => {
  try {
    let categories = await Product.distinct('category', {})
    console.beer(categories)
    res.json(categories)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  let query = {}
  if (req.query.search) {
    query.name = {'$regex': req.query.search, '$options': 'i'}
  }
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category
  }
  try {
    let products = await Product
      .find(query)
      .populate('shop', '_id name')
      .select('-image')
      .exec()
    return res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  req.product.image = undefined
  return res.json(req.product)
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
  read,
  list,
  listByShop,
  listLatest,
  listRelated,
  listCategories,
  productByID,
  image,
  defaultPhoto,
  remove,
  update,
}