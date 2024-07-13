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
    },
    getProducts: async (req , res) => {
        try {
            const products = await Products.find();

            return res.status(200).send({message: "get" , products})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getOneProduct: async (req , res ) => {
        try {
            const {id} = req.params;
            
            const product = await Products.findById(id);

            if(!product) {

                return res.status(404).send({message: "Not found"})
            }
            return res.status(200).send({message: "GEt product" , product})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteProduct: async (req , res) => {
        try {
            const {id} = req.params;

            if(!req.isAdmin){
                res.status(405).send({message: "Not allowed"})
            }
            const product = await Products.findByIdAndDelete(id)
            if(!product){
                return res.status(404).send({message: "Not found"});
            }

            await cloudinary.v2.uploader.destroy(product.image.publicId, async (err) => {
                if(err){
                    throw err
                }
            })

            return res.status(200).send({message: "Deleted"})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updateProduct: async (req , res) => {
        try {
            const {id } =req.params;
            
            if(!req.isAdmin){
                res.status(405).send({message: "Not allowed"})
            }
            
            const product = await Products.findById(id)
            let image = product.image;
            if(!product){
                return res.status(404).send({message: "Not found"});
            }

            if(req.files){
                const content = req.files.image;
                let contentType = content.mimetype.split("/")[0];

                if(contentType == "image" || contentType == "png" || contentType == 'jpg'){
                    const result = await cloudinary.v2.uploader.upload(content.tempFilePath, {folder: 'Pizza'}, async  (err, result) => {
                        if(err){
                            throw err
                        }
                        removeTemp(content.tempFilePath);
                        return result
                    })
                    
                    image = { url: result.url , publicId : result.public_id } 
                    
                    await cloudinary.v2.uploader.destroy(product.image.publicId, async (err) => {
                        if(err){
                            throw err
                        }
                    })
                }else{
                    return res.status(400).send({message: "Your File is not image"})
            }}

            const updProduct = await Products.findByIdAndUpdate(id , {...req.body ,image } , {new: true})
            
            return res.status(200).send({message: "Updated" , product: updProduct})
h
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = productsCtrl