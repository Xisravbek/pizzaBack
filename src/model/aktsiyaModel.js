const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const fs = require('fs')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}

const aksiyaSchema = new mongoose.Schema({
    text: {
        type: String ,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Aksiya" , aksiyaSchema)