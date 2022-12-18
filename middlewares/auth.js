
const jwt = require('jsonwebtoken')
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require('../middlewares/errorhandler');
const Users = require('../Models/Users');


//CHECK IF USER IS LOGGED IN (MIDDLEWARE)
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  const { token } = req.cookies
  if (!token) {
    return next(new ErrorHandler('Login First to access the resources', 401))
  }

  const decoded = jwt.verify(token, process.env.jwt_secret)

  req.user = await Users.findById(decoded.id)
  next()
})


//CHECK IF USER IS ADMIN OR NOT (MIDDLEWARE)
exports.authorizeRoles = (...roles) => {

  return (req, res, next) => {


    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`role (${req.user.role}) is not allowed to access this resource`)
        ,403
      )
    }

    next()
  }

}