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
                const { roomId, date, timeSlot, purpose } = req.body;
                const userId = req.user.userId;

                // Check for existing booking
                const existingBooking = await Booking.findOne({
                        roomId,
                        date,
                        timeSlot
                });

                if (existingBooking) {
                        return res.status(400).json({ message: 'Room is already booked for this time slot.' });
                }

                const newBooking = await Booking.create({
                        userId,
                        roomId,
                        date,
                        timeSlot,
                        purpose
                });

                res.status(201).json(newBooking);
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Something went wrong while booking.', error: err });
        }
});


// Get bookings for logged-in user
router.get('/my', authenticateUser, async (req, res) => {
        const bookings = await Booking.find({ userId: req.user.userId }).populate('roomId');
        res.json(bookings);
});


module.exports = router;
