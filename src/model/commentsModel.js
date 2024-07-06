const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    text: {
        type: String ,
        required: true
    },
    bookingId: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings"
    }
    

})

module.exports = mongoose.model("Comments" , commentsSchema)