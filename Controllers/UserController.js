const User = require('../Models/Users')

const cloudinary = require('cloudinary');
const ErrorHandler = require('../middlewares/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../Utils/jwtToken');
const crypto = require('crypto')
const sendEmail = require('../Utils/sendEmail.js')



///////////////////////////REGISTER USER//////////////////////////////

exports.registerUser = catchAsyncError(async (req, res, next) => {

  cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Cloud_key,
    api_secret: process.env.Cloud_secret
  })

  try {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'Avatars',
      width: 150,
      crop: 'scale'
    })


    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
      },
    })


    sendToken(user, 200, res)

  } catch (error) {
    console.log(error);
  }

})

///////////////////////////LOGIN IN USER//////////////////////////////
exports.loginuser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password is entered by user 

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter email and password'), 400)
  }
  //finding user in the database
  const user = await User.findOne({ email }).select('+password')

  //if user not found!!!

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password'), 404)
  }

  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password'), 404)

  }

  sendToken(user, 200, res)

})

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: 'Loged Out Successfully'
  })
})


///////////////////////////FORGOT PASSWORD//////////////////////////////

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404))
  }

  //get reset token
  const resetToken = await user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  ///////////////////////////RESET PASSWORD URL//////////////////////////////
  const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
  const message = `Your Password reset token is as follows:\n\n${resetURL}\n\n If you have not request this email, then ignore it.`
  console.log(resetURL);
  console.log(message);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Shopit Password Recovery ',
      message
    })
    res.status(200).json({
      success: true,
      message: `Email Send to ${user.email}`
    })

  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false })
    return next(new ErrorHandler(error.message, 500))
  }
})


///////////////////////////RESET PASSWORD//////////////////////////////
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  //hash the URL Token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  })

  if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or expires', 400))
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }

  //Setup new password 
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save()
  sendToken(user, 200, res)
})


///////////////////////////LOGGED IN USER DETAILS//////////////////////////////
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user
  })
})

///////////////////////////CHANGE PASSWORD //////////////////////////////

exports.changePassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password')

  //Check previous user password

  const isMatched = await user.comparePassword(req.body.oldPassword)
  if (!isMatched) {
    return next(new ErrorHandler('Old Password is Incorrect'))
  }

  user.password = req.body.password
  await user.save()
  sendToken(user, 200, res)
  res.status(200).json('Password Updated Successfully!!!')

})

///////////////////////////PROFILE//////////////////////////////

exports.changeProfile = catchAsyncErrors(async (req, res, next) => {

  let newUser = {
    name: req.body.name,
    email: req.body.email,
  }
  //update Avatar
  if(req.body.avatar!==""){
  const ExistingUser = await User.findById(req.user.id)
  const destroyed = await cloudinary.v2.uploader.destroy(ExistingUser.avatar.public_id)

  const avatar = req.body.avatar
  const result = await cloudinary.v2.uploader.upload(avatar, {
    folder: 'Avatars',
    width: 150,
    crop: 'scale'
  })

  newUser = {
    ...newUser, avatar: {
      public_id: result.public_id,
      url: result.secure_url
    }
  }
}

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: true
  })

  res.status(200).json({
    success: true,
    message: "Updated Profile Successfully"
  })

})


///////////////////////////ADMIN ROUTES//////////////////////////////

//Get all Users

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    success: true,
    users
  })

})

//Get Specific Users

exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorHandler(`User does not exist with id ${req.params.id}`))
  }
  res.status(200).json({
    success: true,
    user
  })


})


///////////////////////////UPDATE USER PROFILE////////////////////////////
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: true
  })

  res.status(200).json({
    success: true,
    message: "Updated Profile Successfully"
  })

})


///////////////////////////DELETE USER PROFILE////////////////////////////
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {



  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler('User does not found with this id'))
  }

  await user.remove()

  //remove avatar from cloudinary

  res.status(200).json({
    success: true
  })

})
