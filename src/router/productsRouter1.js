const router = require('express').Router()
const productsCtrl = require('../controller/productsCtrl1');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware , productsCtrl.addProduct);
router.get('/', productsCtrl.getProducts);
router.get("/:id" , productsCtrl.getOneProduct);
router.delete('/:id' , authMiddleware , productsCtrl.deleteProduct);
router.put('/:id' , authMiddleware , productsCtrl.updateProduct)

module.exports = router