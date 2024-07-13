const Bookings = require('../model/bookingsModel');
const Products = require('../model/productsModel')
const {v4} = require('uuid')

const bookingsCtrl ={
    addBooking : async (req , res ) => {
        try {
            const {  payType, products , price } = req.body;
            const consumerId = req.user._id;
            const address = req.user.address;
            const orderId = v4();

            const booking = await Bookings.create({...req.body, address , consumerId , orderId});

            return res.status(201).send({message: "created" , booking})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteBooking: async (req , res) => {
        try {
            const {id} = req.params;
            const oldBooking = Bookings.findById(id);
            if(!oldBooking) {
                return res.status(404).send({message: "Booking not found"})
            }
            if(req.isAdmin) {
                const booking = await Bookings.findByIdAndDelete(id)

                return res.status(200).send({message: "Deleted" , booking})
            }else{
                return res.status(405).send("Not allowed")
            }
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getBooking: async (req, res) => {
        try {
            const id = req.params.id;
            
            const booking = await Bookings.findById(id);

            if(!booking){
                return res.status(404).send({message: "Booking not found"})
            }

            return res.status(200).send({message: "Get booking" , booking})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getUserBookings: async (req ,res ) => {
        try {
            const userId = req.params.id;

            const bookings = await Bookings.find({consumerId: userId});

            return res.status(200).send({message: "Get booking", bookings})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}