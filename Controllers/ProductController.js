const Product = require('../Models/Product')
const APIfeatures = require('../Utils/apifeatures')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../middlewares/errorhandler')



//NEW PRODUCT
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id

  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product
  })

})

//GET PRODUCTS
exports.getproducts = catchAsyncErrors(async (req, res, next) => {

  const prodperpage = 4;
  const totalProducts = await Product.countDocuments()
  const apifeatures = new APIfeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(prodperpage);

  const products = await apifeatures.query;

  res.status(200).json({
    success: true,
    prodperpage,
    totalProducts,
    count: products.length,
    products
  })

})

//GET SINGLE PRODUCT
exports.getsingleproduct = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.params.id)
  if (!product) {
    return next(new ErrorHandler('Product not Found ', 404))

  }
  res.status(200).json({
    success: true,
    product
  })
})

//UPDATE A PRODUCT
exports.updateproduct = catchAsyncErrors(async (req, res, next) => {

  let product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body)

  res.status(200).json({
    success: true,
    product
  })

})

//DELETE A PRODUCT
exports.deleteproduct = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }

  await product.remove()
  res.status(200).json({
    success: true,
    message: 'Product is Deleted'
  })

})



//CREATE NEW REVIEW
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productID } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productID)
  const isReviewed = product.reviews.find(
    rev => rev.user.toString() === review.user._id.toString()
  )

  if (isReviewed) {
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment
        review.rating = rating
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave: false })
  res.status(200).json({
    success: true
  })


})

//GET PRODUCT REVIEWS
exports.getProductReview = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.query.id)

  if (product.reviews === '') {
    return next(new Errorhandler('No Reviews For this Product'))
  }



  res.status(200).json({
    success: true,
    reviews: product.reviews

  })

})

//DELETE REVIEW
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {


  const product = await Product.findById(req.query.productID)

  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  const numOfReviews = reviews.length

  await Product.findByIdAndUpdate(req.query.productID, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,

  })


})