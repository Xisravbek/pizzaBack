const Products = require("../model/productsModel");
const cloudinary = require('cloudinary');
const fs = require('fs')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}

const productsCtrl = {
    addProduct: async (req ,res ) => {
        try {
            if(!req.isAdmin) {
                return res.status(405).send({message: "Not allowed"})
            }
            if(!req.files){
                return res.status(400).send({message: "Please send image"})
            }
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
            
            const product = await Products.create({...req.body , image});
            
            return res.status(201).send({message: "created " , product})
            }else{
                return res.status(400).send({message: "Your File is not image"})
            }


        

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = productsCtrl