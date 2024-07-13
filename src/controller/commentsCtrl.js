const Comments = require('../model/commentsModel');

const commentsCtrl ={
    addComment: async (req , res ) => {
        try {
            const senderId = req.user._id;
            
            const comment = await Comments.create({...req.body , senderId});

            return res.status(201).send({messasge: 'Created' , comment })

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },

    getBookingComments : async (req , res ) => {
        try {
            const bookingId = req.params.id;

            const comments = await Comments.find({bookingId});

            return res.status(200).send({message: "Get comments" , comments})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteComment: async (req ,res ) => {
        try {
            const {id} = req.params;
            const oldComment = await Comments.findById(id)
            if(!req.isAdmin && oldComment.senderId !== req.user._id){
                return res.status(405).send({message: "not allowed"})
            }
            const comment = await Comments.findByIdAndDelete(id);

            if(!comment) {
                return res.status(404).send({message:"Not found"})
            }
            return res.status(200).send({message: "Deleted" , comment})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = commentsCtrl