const router = require('express').Router();
const usersCtrl = require('../controller/usersCtrl');
let a = "D71N4988FM1AA4ZJUNS9N2TK";
const authMiddleware = require('../middleware/authMiddleware')


router.post('/signup' , usersCtrl.signup);
router.post('/login' , usersCtrl.login);
router.delete('/:id' , authMiddleware , usersCtrl.deleteUser)
router.get('/' , usersCtrl.getUsers);
router.get('/:id' , usersCtrl.getOneUser);
router.put("/:id" , authMiddleware , usersCtrl.updateUser );

module.exports = router