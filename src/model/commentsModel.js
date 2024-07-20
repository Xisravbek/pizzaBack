const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    text: {
        type: String ,
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings",
        required: true
    }
    

},
{
    timestamps: true
})

module.exports = mongoose.model("Comments" , commentsSchema)