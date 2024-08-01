const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Done" , "Rejected"],
    },
    address: {
        type: Object , 
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    payType: {
        type: String,
        default: "None",
        enum: ["None", "Cash" , "Card", 'Applepay'],
    },
    products: {
        type: Array,
        required: true
    },
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    timeManagement :{
        type: String
    },
    comment: {
        type: String
    }
    
},
{
    timestamps:true
})

module.exports = mongoose.model("Bookings" , bookingsSchema)