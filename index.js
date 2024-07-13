const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
dotenv.config()
const PORT = process.env.PORT || 4010;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})
//get routes
const usersRouter = require('./src/router/usersRouter')
const productsRouter = require('./src/router/productsRouter1');
const categoryRouter = require('./src/router/categoryRoutere');
const bookingRouter = require('./src/router/bookingRouter')

const app = express()
//miidlwares

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send("home")
})

//use routes

app.use('/users' , usersRouter);
app.use('/products', productsRouter);
app.use('/category' , categoryRouter);
app.use("/booking" , bookingRouter)

const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL , {}).then(() => {
   
    app.listen(PORT , console.log(`Server started on ${PORT} PORT`))
}).catch(err => {
    console.log(err);
})

