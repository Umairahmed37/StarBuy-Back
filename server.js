
const app = require('./app')
const connectDatabase = require('./Config/Database')
const cloudinary = require('cloudinary')

const cors = require('cors')


process.on('uncaughtException',err=>{
  console.log(`ERROR ${err}`)
  console.log("SHUTTING DOWN DATABASE");
  process.exit(1)
})

cloudinary.config({
  cloud_name:process.env.Cloud_name,
  api_key:process.env.Cloud_key,  
  api_secret: process.env.Cloud_secret
})

//connection to database 
connectDatabase()
//env file attached
const dotenv = require('dotenv')
dotenv.config();

 //application is listening to port
app.listen(process.env.PORT,() => 
console.log(`Server listening on port ${process.env.PORT}`)
 )