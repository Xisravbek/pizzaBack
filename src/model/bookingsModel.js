const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    orderId: {
        type:String,
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
        type:String,
        required: true
    },
    payType: {
        type: String,
        default: "None",
        enum: ["None", "Cash" , "Card"],
    },
    products: {
        type: Object,
        required: true
    },
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
    
})

module.exports = mongoose.model("Bookings" , bookingsSchema)