
//Checks if user is authenticated or not
const jwt= require('jsonwebtoken')
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler=require('../middlewares/errorhandler');
const Users = require('../Models/Users');


exports.isAuthenticatedUser= catchAsyncErrors(async (req, res,next)=>{

  const {token}= req.cookies
  if(!token){
    return next(new ErrorHandler('Login First to access the resources',401))
  }

  const decoded= jwt.verify(token,process.env.jwt_secret)
  
  req.user = await Users.findById(decoded.id)
  next()
})


//check if the user is admin or not by authorization
exports.authorizeRoles= (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(
        new ErrorHandler(`role (${req.user.role}) is not allowed to access this resource`),403
        )
    }
    next()
  }
}