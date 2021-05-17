import express from 'express'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/shops')
  .get(shopCtrl.list)

router.route('/api/shops/:shopId')
  .get(shopCtrl.read)

router.route('/api/shops/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.update)

router.route('/api/shops/:shopId')
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)

router.route('/api/shops/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization,
    userCtrl.isSeller, shopCtrl.create)

router.route('/api/shops/by/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization,
    shopCtrl.listByOwner)

router.route('/api/shops/logo/:shopId')
  .get(shopCtrl.photo, shopCtrl.defaultPhoto)

  router.route('/api/shops/defaultPhoto')
  .get(shopCtrl.defaultPhoto)

router.param('userId', userCtrl.userByID)
router.param('shopId', shopCtrl.shopByID)

export default router
