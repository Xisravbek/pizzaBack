const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    title: {
        type: String ,
        required: true
    },
    minPrice: {
        type: String,
        required: true
    },
    givePrice: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model("Promo" , promocodeSchema)