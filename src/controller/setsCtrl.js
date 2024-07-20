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
       try {
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
       } catch (error) {
        return res.status(503).send({message: error.message})
       }

        
    },
    getSets: async (req , res ) => {
        try {
            const kombos = await Sets.find();
            
            return res.status(200).send({message: "Get Kombos" , kombos})
        } catch (error) {
            return res.status(503).send({message: "Your File is not image"})
        }
    },
    getOneSet : async (req , res ) => {
        try {
            const {id} = req.params;

            const kombo = await Sets.findById(id);

            return res.status(200).send({message: "Get one kombo" , kombo})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteSet : async (req ,res) => {
        try {
            const {id} = req.params;
            console.log(req.isAdmin);
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            const kombo = await Sets.findByIdAndDelete(id)

            if(!kombo){
                return res.status(404).send({message: "Not found"})
            }

            await cloudinary.v2.uploader.destroy(kombo.image.publicId, async (err) => {
                if(err){
                    throw err
                }
            })

            return res.status(200).send({message: "Deleted" , kombo})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = setsCtrl