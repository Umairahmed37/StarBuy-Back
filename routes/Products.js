const express = require('express')
const router = express.Router()
 
const {getproducts}= require('../Controllers/ProductController')

router.route('/products').get(getproducts)

module.exports = router