import express from 'express'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import productCtrl from '../controllers/product.controller'

const router = express.Router()

router.route('/api/products/by/:shopId')
  .post(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.create)

router.param('shopId', shopCtrl.shopByID)

export default router
