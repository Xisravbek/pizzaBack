const router = require('express').Router();
const ingredientsCtrl = require('../controller/ingredientsCtrl');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware , ingredientsCtrl.addIngredient);
router.put('/:id', authMiddleware , ingredientsCtrl.updateIngredient);
router.get('/products/:id' , ingredientsCtrl.getIngredientProducts);
router.get('/extra/:id' , ingredientsCtrl.getExtraIngredient)
router.get('/:id', ingredientsCtrl.getOneIngredient);
router.get('/', ingredientsCtrl.getIngredients);
router.delete('/:id' , authMiddleware , ingredientsCtrl.deleteIngredient)


module.exports = router