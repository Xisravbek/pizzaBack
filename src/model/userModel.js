const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: String,
        default : "0"
    },
    basket: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        default: "user",
        enum:[ "admin", "user" , "curier"]
    },
    address: {
        type: Object,
    }, history: {
        type: Array,
        default: []
    },

},
{
    timestamps: true
})

module.exports = mongoose.model("User" , userSchema)