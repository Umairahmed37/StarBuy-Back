
const Cloudinary = require('cloudinary').v2;

Cloudinary.config({
  cloud_name:process.env.Cloud_name,
  api_key:process.env.Cloud_key,
  api_secret:process.env.Cloud_secret,
})

module.exports=Cloudinary