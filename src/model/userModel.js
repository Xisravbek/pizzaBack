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
    birtDate: {
        type: String,
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
        required: true
    }, history: {
        type: Array,
        default: []
    },

})

module.exports = mongoose.model("User" , userSchema)