const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

router.get('/protected', authenticateUser, (req, res) => {
        res.json({ message: `Hello, ${req.user.userId}. You have access.` });
});



// Book a room
router.post('/', authenticateUser, async (req, res) => {
        try {
                const booking = await Booking.create({
                        ...req.body,
                        userId: req.user.userId
                });
                res.status(201).json(booking);
        } catch (err) {
                res.status(400).json({ message: 'Failed to book room', error: err });
        }
});

// Get bookings for logged-in user
router.get('/my', authenticateUser, async (req, res) => {
        const bookings = await Booking.find({ userId: req.user.userId }).populate('roomId');
        res.json(bookings);
});


module.exports = router;
