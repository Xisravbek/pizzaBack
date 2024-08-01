const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
    title: {
        type: String ,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    products:{
        type: Array,
        default: []
    },
    
    productsObj:{
    },
    price:{
        type: String,
        required: true
    },
    productExtra:{
        type: Array,
        default: []
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Ingredients" , ingredientsSchema)