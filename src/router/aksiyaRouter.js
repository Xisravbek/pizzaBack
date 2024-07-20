const router = require('express').Router()
const aksiyaCtrl = require('../controller/aksiyaCtrl');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware , aksiyaCtrl.addAksiya);
router.get('/' , aksiyaCtrl.getAksiya);
router.delete('/:id' , authMiddleware , aksiyaCtrl.deleteAksiya)


module.exports = router