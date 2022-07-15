const express = require('express')
const router = express.Router()

const {newOrder, myOrders,getSingleOrder, adminGetOrders, adminUpdateOrder, adminDeleteOrder} =require('../Controllers/OrderController')

const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth')

//new order
router.route('/order/new').post(isAuthenticatedUser,newOrder)
//my Orders
router.route('/orders/me').get(isAuthenticatedUser,myOrders)
//get single order
router.route('/order/:id').post(isAuthenticatedUser,getSingleOrder)


//ADMIN
//admin get all orders
router.route('/admin/orders/').get(isAuthenticatedUser,authorizeRoles('admin') ,adminGetOrders)

router.route('/admin/order/:id')
.put(isAuthenticatedUser,authorizeRoles('admin') ,adminUpdateOrder)
.delete(isAuthenticatedUser,authorizeRoles('admin') ,adminDeleteOrder)
 
module.exports = router
