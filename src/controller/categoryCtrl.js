const { default: mongoose } = require('mongoose');
const Category = require('../model/categoryModel')
const Products = require('../model/productsModel')
const cloudinary = require('cloudinary');
const fs = require('fs')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}

const categoryCtrl = {
    addCategory: async (req, res ) => {
        try {
            const {title} = req.body;
            if(!title){
                return res.status(400).send({message: "Please send title"});
            }
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            if(!req.files?.image){
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
                     const category = await Category.create({title, image});
                     return res.status(201).send({message: "Created category" , category});
                
                }else{
                    return res.status(400).send({message: "Your File is not image"})
                }

            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getCategory:async (req ,res) => {
        try {
            const {id}  = req.params;
            
            const category = await Category.aggregate([
                {$match: {_id: new mongoose.Types.ObjectId(id)}},
                {$lookup : {from: 'products' , let : {categoryId: "$_id"},
                pipeline: [
                    {$match: {$expr : {$eq :["$categoryId" , "$$categoryId"]}}}
                ],
                as: 'products'}}
                
            ]);

            return res.status(200).send({message: "Get category", category})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getAllCategories: async (req ,res ) => {
        try {
            
            const categories = await Category.find();

            return res.status(200).send({message: "Get categories", categories})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteCategory: async (req , res ) => {
        try {
            const {id} = req.params;
            
            const oldCategory = await Category.findById(id);
            if(!oldCategory) {
                return res.status(404).send({message: "Not found"})
            }
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            const products = await Products.find({categoryId: id});
            
            //delete category image
            await cloudinary.v2.uploader.destroy(oldCategory.image.publicId, async (err) => {
                if(err){
                    throw err
                }
            })

            //delete products images
            for(let i =0; i < products.length ; i ++) {
                await cloudinary.v2.uploader.destroy(products[i].image.publicId, async (err) => {
                    if(err){
                        throw err
                    }
                })
            }
            await Products.deleteMany({categoryId: id});

            const category = await Category.findOneAndDelete(id);
            return res.status(200).send({message: "Deleted" , category})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updateCategory: async (req ,res) => {
        try {
            const {id} = req.params;
            const {title } = req.body;
             
            const oldCategory = await Category.findById(id);
            if(!oldCategory) {
                return res.status(404).send({message: "Not found"})
            }
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            if(!title){
                return res.status(400).send({message: "Nothing to update"})
            }
            const category = await Category.findByIdAndUpdate(id , {title} , {new: true})
            return res.status(200).send({message: "Updated" , category})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getCategoryProducts: async (req , res) => {
        try {
            
            const categories = await Category.aggregate([
                {$lookup : {from: 'products' , let : {categoryId: "$_id"},
                pipeline: [
                    {$match: {$expr : {$eq :["$categoryId" , "$$categoryId"]}}}
                ],
                as: 'products'}}
                
            ]);

            return res.status(200).send({message: "Get categories" , categories})

        } catch (error) {
            return res.status(503).send({message: error.message})   
        }
    }
}

module.exports = categoryCtrl