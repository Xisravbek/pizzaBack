const mongoose = require('mongoose');

const setsSchema = new mongoose.Schema({
    title: {
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
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    products: {
        type: Array,
        required: true
        
    }
    

},
{
    timestamps: true
})

module.exports = mongoose.model("Sets" , setsSchema)