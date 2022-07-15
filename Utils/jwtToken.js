//create and send token and save in the cookies

const sendToken = (user,statuscode,res)=>{
  const token = user.getJwtToken()

  //options for cookies.
  const options={
    expires:new Date(
      Date.now() + process.env.cookie_expire * 24 * 60 * 1000
    ),
    httpOnly:true
  }

  res.status(statuscode).cookie('token',token,options).json({
    success:true,
    user,
    token
  })

}

module.exports = sendToken