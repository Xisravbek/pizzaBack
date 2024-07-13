const router = require('express').Router();

const bookingCtrl = require('../controller/bookingsCtrl');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware , bookingCtrl.addBooking);
router.delete('/:id' , authMiddleware , bookingCtrl.deleteBooking);
router.get('/my-bookings/:id', authMiddleware , bookingCtrl.getUserBookings)
router.get('/:id' , bookingCtrl.getBooking);
router.put('/:id' , authMiddleware , bookingCtrl.updateBooking)

module.exports = router