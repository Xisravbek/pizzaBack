const router = require('express').Router();

const categoryCtrl = require('../controller/categoryCtrl');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/' , authMiddleware, categoryCtrl.addCategory);
router.get('/:id' , categoryCtrl.getCategory);
router.get('/' , categoryCtrl.getAllCategories);
router.delete('/:id', authMiddleware , categoryCtrl.deleteCategory)
router.put('/:id' , authMiddleware , categoryCtrl.updateCategory)

module.exports = router