const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({


  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Your name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [6, 'password must be at least 6 characters'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

//hashing the user passowrd for security
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredpass) {
  return await bcrypt.compare(enteredpass, this.password)
}

//return json web token to our logged in users
userSchema.methods.getJwtToken = function () {
  return jwt.sign(

    { id: this._id },
    process.env.jwt_secret,
    { expiresIn: process.env.jwt_expire_time }

  )
}

//Creating password reset token

userSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  //hash and set to resetpasswordtoken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  //set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
  return resetToken
}


module.exports = mongoose.model('User', userSchema)