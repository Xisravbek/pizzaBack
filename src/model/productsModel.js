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
        
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    size: {
        type:String
    },
    portion: {
        type: String,
        required: true   
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
    

},
{
    timestamps: true
})

module.exports = mongoose.model("Products" , productSchema)