const Ingredients = require('../model/ingredientsModel');
const Products = require('../model/productsModel')
const cloudinary = require('cloudinary');
const fs = require('fs');
const mongoose = require('mongoose')


const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) {
            throw err
        }
    })
}

const ingredientsCtrl = {
    addIngredient: async (req, res ) => {
        try {
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            if(!req.files){
                return res.status(400).send({message: "Please send a image"})
            }

            const content = req.files.image;
            let image;
            let contentType = content.mimetype.split("/")[0];
            let { title , products , price, productExtra } = req.body;
            
            products = JSON.parse(products)
            if(!productExtra){
                productExtra = []
            }else{
                productExtra = JSON.parse(productExtra)
            }

            if(contentType == "image" || contentType == "png" || contentType == 'jpg'){
                    const result = await cloudinary.v2.uploader.upload(content.tempFilePath, {folder: 'Pizza'}, async  (err, result) => {
                        if(err){
                            throw err
                        }
                        removeTemp(content.tempFilePath);
                        return result
                    })
                    
                     image = { url: result.url , publicId : result.public_id } 
                
                    const ingredient = await Ingredients.create({image , products , title, price , productExtra})

                    return res.status(201).send({message: "Ingredient created" , ingredient})
                
                }else{
                    return res.status(400).send({message: "Your File is not image"})
                }

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updateIngredient: async (req, res) => {
        try {
            const {id} = req.params;
            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            
            let oldIngredient = await Ingredients.findById(id)
            
            if(!oldIngredient){
                return res.status(404).send({message: "Not found"})
            }
            let image;
            let {title, price } = req.body;

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

                     await cloudinary.v2.uploader.destroy(oldIngredient.image.publicId, async (err) => {
                        if(err){
                            throw err
                        }
                    })
                }else{
                    return res.status(400).send({message: "Your File is not image"})
                }
            }else{
                image = oldIngredient.image
            }
            
            let products = oldIngredient.products
            let productExtra = oldIngredient.productExtra
            let removeDublicate = (arr) => {
                let result = []
                arr.forEach(prod => {
                    if(!result.includes(prod)) {
                        result.push(prod)
                    }
                })
                return result
            }
            
            if(req.body.products){
                
                products = [...oldIngredient.products, ...req.body.products]
                console.log(products , req.body);
                products = removeDublicate(products)
            }
            if(req.body.productExtra){
                productExtra = [...oldIngredient.productExtra , ...req.body.productExtra]
                productExtra = removeDublicate(productExtra)
            }
            if(!price)
                price = oldIngredient.price
            if(!title){
                title = oldIngredient.title
            }

            const ingredient = await Ingredients.findByIdAndUpdate(id , {image, products , title , productExtra} , {new: true})
            
            return res.status(200).send({message: "Updated", ingredient })

        } catch (error) {
            return res.status(503).send({message: error.message}) 
        }
    },
    getOneIngredient: async (req , res ) => {
        try {
            const {id} = req.params;
            
            let ingredient = await Ingredients.findById(id);

            if(!ingredient){
                return res.status(404).send({message: "Not found"})
            }

            const products = await Products.aggregate([
                {
                    $match: {
                        _id: { $in: ingredient.products.map(id => new mongoose.Types.ObjectId(id)) }
                    }
                }
            ])
            ingredient.productsObj = products
            
            return res.status(200).send({message: "Get ingredient" ,ingredient })
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getIngredients: async (req, res  ) => {
        try {
            const ingredients = await Ingredients.find();

            return res.status(200).send({message: "Get ingredients" , ingredients})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getIngredientProducts: async (req , res ) => {
        try {
            const productId = req.params.id;

            const ingredients = await Ingredients.find({ products: { $in: [productId] } });

            return res.status(200).send({message: "Get ingredients" , ingredients})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteIngredient: async (req , res ) => {
        try {
            const {id} = req.params;

            if(!req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }

            const oldIngredient = await Ingredients.findById(id)

            if(!oldIngredient){
                return res.status(404).send({message: "Not found"})
            }

            await cloudinary.v2.uploader.destroy(oldIngredient.image.publicId, async (err) => {
                if(err){
                    throw err
                }
            })

            const ingredient =await Ingredients.findByIdAndDelete(id);

            return res.status(200).send({message: "Deleted" , ingredient})


        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    } ,
    getExtraIngredient: async (req , res )=> {
        try {
            const productId = req.params.id;
            const ingredients = await Ingredients.find({ productExtra: { $in: [productId] } });

            return res.status(200).send({message: "Get ingredients" , ingredients})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }


}

module.exports = ingredientsCtrl