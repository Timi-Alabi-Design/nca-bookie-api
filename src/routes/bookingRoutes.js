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

// Update a booking (only by owner)
router.put('/:id', authenticateUser, async (req, res) => {
        try {
                const booking = await Booking.findById(req.params.id);

                if (!booking) return res.status(404).json({ message: 'Booking not found.' });

                // Only the user who booked can update it
                if (booking.userId.toString() !== req.user.userId) {
                        return res.status(403).json({ message: 'Not authorized to update this booking.' });
                }

                // Check for duplicate booking before updating
                const { roomId, date, timeSlot } = req.body;

                const conflict = await Booking.findOne({
                        _id: { $ne: req.params.id },
                        roomId,
                        date,
                        timeSlot
                });

                if (conflict) {
                        return res.status(400).json({ message: 'Room is already booked for that time.' });
                }

                const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true
                });

                res.json(updated);
        } catch (err) {
                res.status(500).json({ message: 'Failed to update booking.', error: err });
        }
});

// Cancel (delete) a booking
router.delete('/:id', authenticateUser, async (req, res) => {
        try {
                const booking = await Booking.findById(req.params.id);

                if (!booking) return res.status(404).json({ message: 'Booking not found.' });

                // Ensure only owner can delete
                if (booking.userId.toString() !== req.user.userId) {
                        return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
                }

                await booking.deleteOne();
                res.json({ message: 'Booking cancelled successfully.' });
        } catch (err) {
                console.log("Error canceling booking: ", err)
                res.status(500).json({ message: 'Failed to cancel booking.', error: err });
        }
});




// Get bookings for logged-in user
router.get('/my', authenticateUser, async (req, res) => {
        const bookings = await Booking.find({ userId: req.user.userId }).populate('roomId');
        res.json(bookings);
});


module.exports = router;
