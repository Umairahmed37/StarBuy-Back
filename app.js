const express = require('express')
const cors=require('cors')
const app = express()

const cookieParser= require('cookie-parser')
const bodyparser = require('body-parser')
const fileUpload= require('express-fileUpload')

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
app.use(fileUpload())


const products = require('./routes/Products')
const user= require('./routes/Users')
const order = require('./routes/Order')


app.use('/api/v1',products)
app.use('/api/v1',user)
app.use('/api/v1',order)


module.exports= app

