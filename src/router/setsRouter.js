const router = require('express').Router();
const setsCtrl = require('../controller/setsCtrl');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware , setsCtrl.addSet)
router.get('/' , setsCtrl.getSets);
router.get('/:id' , setsCtrl.getOneSet)
router.delete('/:id' ,authMiddleware ,  setsCtrl.deleteSet);
router.put('/:id' , authMiddleware , setsCtrl.updateSet)

module.exports = router