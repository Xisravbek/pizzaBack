const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size,
    portion: {
        type: String,
        required: true   
    },
    type: {
        type: String,
        enum: ["pizza" , "sushi", 'napitok' , "zakuski" , "desert" , "souses" , 'kombo'] 
    }
    

})

module.exports = mongoose.model("Products" , productSchema)