const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload')
dotenv.config()
const PORT = process.env.PORT || 4010;


const app = express()
//miidlwares

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send("home")
})

const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL , {}).then(() => {
   
    app.listen(PORT , console.log(`Server started on ${PORT} PORT`))
}).catch(err => {
    console.log(err);
})