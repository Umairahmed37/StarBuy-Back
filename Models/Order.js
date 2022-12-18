const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({

  //Shipping Information
  shippinginfo: {
    Address: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
    },
    PostalCode: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    }
  },

  //user info
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  //order items
  orderItems: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    }
  }],

  paidAt:{
    type:Date,
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0

  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0

  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus:{ 
    type:String,
    required: true,
    default: 'Processing'
  },
  deliveredAt:{
    type:Date,

  },
  createdAt:{
    type:Date,
    default: Date.now
  }

})


module.exports = mongoose.model('Order', orderSchema)