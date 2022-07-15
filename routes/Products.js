const express = require('express')
const router = express.Router()
  
const {
  getproducts,
  newProduct, 
  getsingleproduct, 
  updateproduct, 
  deleteproduct, 
  createReview, 
  getProductReview, 
  deleteReview }= require('../Controllers/ProductController')

const {isAuthenticatedUser, authorizeRoles}= require('../middlewares/auth')


router.get('/products'// ,isAuthenticatedUser
,getproducts)

router.get('/getsingleproduct/:id'//,authorizeRoles('admin') 
,getsingleproduct)

router.post('/Admin/product/new',isAuthenticatedUser,authorizeRoles('admin') ,newProduct)
router.put('/Admin/updateproduct/:id',isAuthenticatedUser,authorizeRoles('admin') ,updateproduct)
router.delete('/Admin/deleteproduct/:id',isAuthenticatedUser,authorizeRoles('admin') ,deleteproduct)
router.route('/review').put(isAuthenticatedUser,createReview)
router.route('/ProductReviews').get(isAuthenticatedUser,getProductReview).delete(isAuthenticatedUser,deleteReview)

module.exports = router