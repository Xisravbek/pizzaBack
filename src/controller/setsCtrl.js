const fs = require('fs');
const cloudinary = require('cloudinary');
const Sets = require('../model/setsModel')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}

const setsCtrl = {
    addSet : async (req , res ) => {
        if(!req.files){
            return res.status(400).send({message: "Please send Image"})
        }
        let products  = JSON.parse(req.body?.products);
        

        const content = req.files.image;
        let image;
        let contentType = content.mimetype.split("/")[0];

        if(contentType == "image" || contentType == "png" 
        || contentType == 'jpg'
        ){
            const result = await cloudinary.v2.uploader.upload(content.tempFilePath, {folder: 'Pizza'}, async  (err, result) => {
                if(err){
                    throw err
                }
                removeTemp(content.tempFilePath);
                return result
            })
            
        image = { url: result.url , publicId : result.public_id } 

        const kombo = await Sets.create({...req.body , products , image})

        return res.status(201).send({message: "Created" , kombo})

        }else{
            return res.status(400).send({message: "Your File is not image"})
        }

        
    }
}

module.exports = setsCtrl