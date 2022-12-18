const Order = require('../Models/Order')

const Product = require('../Models/Product')

const Errorhandler = require('../middlewares/errorhandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../middlewares/errorhandler')

//NEW ORDER
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

  const {
    orderItems,
    shippinginfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,

  } = req.body

  const order = await Order.create({
    orderItems,
    shippinginfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    userid: req.user._id,

  })

  res.status(200).json({
    status: 'success',
    order
  })


})

//GET SINGLE ORDER
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {

  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (!order) {
    return next(new ErrorHandler('No Order found with this ID'), 404)

  }
  res.status(200).json({
    status: 'success',
    order
  })
})

//GET LOGGED USER ORDERS
exports.myOrders = catchAsyncErrors(async (req, res, next) => {


  const order = await Order.find({
    userid: req.user._id
  })


  res.status(200).json({
    status: 'success',
    order
  })
})


//ADMIN

//ADMIN GET ALL ORDERS
exports.adminGetOrders = catchAsyncErrors(async (req, res, next) => {

  const order = await Order.find()

  let totalAmmount = 0;
  let numofOrders = 0
  order.forEach(orders => {
    totalAmmount += orders.totalPrice
    numofOrders++
  })

  res.status(200).json({
    status: 'success',
    totalAmmount,
    numofOrders,
    order
  })
})

//ADMIN UPDATE USER ORDER
exports.adminUpdateOrder = catchAsyncErrors(async (req, res, next) => {

  const order = await Order.findById(req.params.id)

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('you have already delivered this order'))
  }

  order.orderItem.forEach(async item => {
    await updateStock(item.product, item.quantity)
  })

  order.orderStatus = req.body.status
  order.delivered = Date.now()
  await order.save()

  res.status(200).json({
    success: true,

  })
})

async function updateStock(id, quantity) {
  const product = await Product.findById(id)
  product.stock = product.stock - quantity
  await product.save({ validateBeforeSave: false })
}


//ADMIN DELETE ORDER
exports.adminDeleteOrder = catchAsyncErrors(async (req, res, next) => {

  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandle('No order found with this ID'), 404)
  }

  await order.remove()

  res.status(200).json({
    status: 'success'
  })
})