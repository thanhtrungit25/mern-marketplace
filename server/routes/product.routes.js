import express from 'express'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import productCtrl from '../controllers/product.controller'

const router = express.Router()

router.route('/api/products/defaultPhoto')
  .get(productCtrl.defaultPhoto)

router.route('/api/products/image/:productId')
  .get(productCtrl.image, productCtrl.defaultPhoto)

router.route('/api/products/:productId')
  .get(productCtrl.read)

router.route('/api/products/latest')
  .get(productCtrl.listLatest)

router.route('/api/products/related/:productId')
  .get(productCtrl.listRelated)

router.route('/api/products/by/:shopId')
  .post(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.create)

router.route('/api/products/by/:shopId')
  .get(productCtrl.listByShop)

router.route('/api/product/:shopId/:productId')
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.remove)

router.param('shopId', shopCtrl.shopByID)
router.param('productId', productCtrl.productByID)

export default router
