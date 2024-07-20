const Aksiya = require('../model/aktsiyaModel');
const cloudinary = require('cloudinary');
const fs = require('fs')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}


const aksiyaCtrl = {
    addAksiya: async ( req , res ) => {
        try {
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            if(!req.files){
                return res.status(400).send({message: "Please send image"})
            }
            if(!req.files.image){
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
                    
                     const aksiya = await Aksiya.create({image , ...req.body });

                     return res.status(201).send({message: "Created aksiya " , aksiya})
                
                }else{
                    return res.status(400).send({message: "Your File is not image"})
                }

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getAksiya: async (req ,res ) => {
        try {
            const aksiya = await Aksiya.find();

            return res.status(200).send({message: "Get aksiya" , aksiya})
        } catch (error) {
            return res.status(503).send({message: error.message}) 
        }
    },
    deleteAksiya: async (req, res ) => {
        try {
            const {id} = req.params;

            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            
            const aksiya = await Aksiya.findByIdAndDelete(id);
            if(!aksiya){
                return res.status(404).send({message: "Not found"})
            }

            await cloudinary.v2.uploader.destroy(aksiya.image.publicId, async (err) => {
                if(err){
                    throw err
                }
            })

            return res.status(200).send({message: "Aksiya deleted" , aksiya})


        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = aksiyaCtrl