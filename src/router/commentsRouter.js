const router = require('express').Router()
const commentsCtrl = require('../controller/commentsCtrl');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware , commentsCtrl.addComment);
router.get('/:id' , commentsCtrl.getBookingComments);
router.delete('/:id' , authMiddleware , commentsCtrl.deleteComment)


module.exports = router