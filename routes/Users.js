const express = require('express')
const router = express.Router()
  
const {registerUser,loginuser,logout, forgotPassword, resetPassword, getUserProfile, changePassword, changeProfile,allUsers, getUserDetail, updateUser, deleteUser }= require('../Controllers/UserController')

const {isAuthenticatedUser,authorizeRoles}= require('../middlewares/auth')


//AUTH ROUTES
router.route('/register').post(registerUser)
router.route('/login').post(loginuser)
router.route('/logout').get(logout)

//ME AND UPDATE
router.route('/me').get(isAuthenticatedUser ,getUserProfile)
router.route('/me/update').put(isAuthenticatedUser,changeProfile)


//PASSWORD ROUTES
router.route('/password/update').put(isAuthenticatedUser,changePassword)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)



//ADMIN ROUTES
router.route('/Admin/Users')
.get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)

router.route('/Admin/Users/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetail)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)


module.exports = router