const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


const usersCtrl = {
    signup: async (req , res ) => {
        const {name , telephone , email , birthDate , password , money , basket, role , address , history} = req.body;
        try {
            if(!name , !telephone , !email  , !password  ){
                return res.status(400).send({message: "Please send all required informations"})
            }
            const oldUser = await Users.findOne({$or: [{email} , {telephone}]})
            if(oldUser){
                return res.status(400).send({message: "This user already exists"})
            }

            const hashedPass = await bcrypt.hash(password ,10);
            req.body.password = hashedPass;

            
            


            const user = await Users.create(req.body);

            delete user._doc.password;

            const token = await jwt.sign(user._doc , SECRET_KEY);

            return res.status(201).send({message: "User was created", user , token })
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    login: async (req ,res ) => {
        const {telephone , email , password } = req.body;
        try {
            const user = await Users.findOne({$or: [{email} , {telephone}]});
            
            if(!user) {
                return res.status(404).send({message: "User not found"})
            }
            const verifyPassword = await bcrypt.compare( password , user._doc.password);
            
            if(!verifyPassword){
                return res.status(400).send({message: "Password is incorrect"})
            };

            delete user._doc.password;

            const token = await jwt.sign(user._doc, SECRET_KEY);

            return res.status(200).send({message: "Log in suceessfuly" , user , token})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteUser: async (req , res ) =>{
        try {
            const {id} = req.params;
            
            const user = await Users.findById(id);

            if(!user){
                return res.status(404).send({message: "User not found"})
            }
            if(user._id !== req.user._id && !req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }

            const olduser = await Users.findByIdAndDelete(id);
            return res.status(200).send({message: "Deleted" , user: olduser})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getUsers: async (req, res ) => {
        try {
            
            const users = await Users.find();

            users.map(user => {
                delete user._doc.password
            })

            return res.status(200).send(users)
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getOneUser: async (req, res) => {
        try {
            const {id} = req.params;
            const user = await Users.findById(id);
            if(!user)  {
                return res.status(404).send({message: "User not found"})
            }
            delete user._doc.password;
            return res.status(200).send({message: "get user" , user})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updateUser : async (req ,res )=> {
        try {
            const {id} = req.params;
            const olduser = await Users.findById(id);
            if(!olduser)  {
                return res.status(404).send({message: "User no found"})
            };
            if(req.user._id !== olduser._id && !req.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }
            if(req.body.password){
                const hashedPass = await bcrypt.hash(req.body.password ,10);
                req.body.password = hashedPass
            }
            if(req.body.role){
                delete req.body.role
            }
            if(req.body.address) {
                req.body.address = JSON.parse(req.body.address)
            }
            const user = await Users.findByIdAndUpdate(id , req.body , {new: true});
            delete user._doc.password
            return res.status(200).send({message: "Updated" , user})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = usersCtrl