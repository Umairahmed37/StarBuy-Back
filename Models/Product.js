const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: [true, 'Please Enter Product Name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please Enter Price'],
    MaxLength: [5, 'Product price cannot exceed 5 characters'],
    default: 0.0
  },
  description: {
    type: String,
    required: [true, 'Please Enter Description']
  },
  rating: {
    type: Number,
    default: 0
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  categories: {
    type: String,
    required: [true, 'Please Enter Category for the Product'],
    enum: {
      values: [
        'Electronics',
        'Camera',
        'Laptop',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Cloths/Shoes',
        'Beuty/Health',
        'Sports',
        'Outdoor',
        'Home'
      ],
      message: "Please Select category for product"
    }
  },
  seller: {
    type: String,
    required: [true, 'Please Enter Product Seller']
  },
  stock: {
    type: Number,
    required: [true, 'Please Enter Product Stock'],
    maxLength: [5, 'Product name cannot exceed 5 characters'],
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user:{
       type:mongoose.Schema.ObjectId,
       ref:'User', 
       required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  createdAt: {
    type:Date,
    default: Date.now
  }

})


module.exports= mongoose.model('Product',productSchema)