const dotenv = require('dotenv');

dotenv.config();
const mongoose = require('mongoose')

const connectDatabase = async () => {

  try {
     await mongoose.connect(process.env.Database,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }) 
  } catch (error) {
    console.log("error connection", error);
  }


}
module.exports = connectDatabase 