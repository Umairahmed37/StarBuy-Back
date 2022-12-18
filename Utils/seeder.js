const Product = require('../Models/Product')
const dotenv = require('dotenv')
const connectDatabse = require('../Config/Database')

const products = require('../Data/product.json')

//SEtting dotenv file
dotenv.config()

connectDatabse()

const seedProducts = async () => {
  try {

 
    await Product.deleteMany()
    console.log("Products deleted");

    await Product.insertMany(products)
    console.log("Added all products");

    process.exit()

  } catch (error) {
    console.log(error.message);
    process.exit()
  }
}

seedProducts()