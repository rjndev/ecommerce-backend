const express = require('express')
const mongoose = require('mongoose')
const app = express()
const router = express.Router()
const dotenv = require('dotenv')
const cors = require('cors')


//routes
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')

const port = 4001

dotenv.config()


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true, useUnifiedTopology : true})

const db = mongoose.connection


db.on('error', console.error.bind(console, "Connection error"))
db.once('open', ()=> console.log("Connected to mongoDB"))


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

//USE routes
//all goes through api route
app.use('/api/users', userRoutes, orderRoutes)
app.use('/api/products', productRoutes)

app.listen(process.env.PORT || port, ()=> console.log(`Listening at port ${process.env.PORT || port}`))
