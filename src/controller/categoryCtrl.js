const { default: mongoose } = require('mongoose');
const Category = require('../model/categoryModel')
const Products = require('../model/productsModel')
const cloudinary = require('cloudinary')

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

            const category = await Category.create({title});
            return res.status(201).send({message: "Created" , category});
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

            for(let i =0; i < products.length ; i ++) {
                await cloudinary.v2.uploader.destroy(products[i].image.publicId, async (err) => {
                    if(err){
                        throw err
                    }
                })
            }
            await Products.deleteMany({categoryId: id});

            const category = await Category.findOneAndDelete(id);
            return res.statsu(200),send({message: "Deleted" , category})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updateCategory: async (req ,res) => {
        try {
            const {id} = req.params;

             
            const oldCategory = await Category.findById(id);
            if(!oldCategory) {
                return res.status(404).send({message: "Not found"})
            }
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }

             
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = categoryCtrl