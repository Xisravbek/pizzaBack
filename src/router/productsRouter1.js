const router = require('express').Router()
const productsCtrl = require('../controller/productsCtrl1');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware , productsCtrl.addProduct);
// router.get('/', pro)

module.exports = router