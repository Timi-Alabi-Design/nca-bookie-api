const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

// Protected Test Route
router.get('/protected', authenticateUser, (req, res) => {
        res.json({ message: `Hello, ${req.user.name}. You have access.` });
});

// Book a room
router.post('/', authenticateUser, async (req, res) => {
        console.log("Booking Route Hit");
        try {
                const { roomId, date, timeSlot, purpose } = req.body;
                const userId = req.user._id; // ✅ Fixed

                const existingBooking = await Booking.findOne({ roomId, date, timeSlot });
                if (existingBooking) {
                        return res.status(400).json({ message: 'Room is already booked for this time slot.' });
                }

                const newBooking = await Booking.create({ userId, roomId, date, timeSlot, purpose });
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

                if (booking.userId.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ message: 'Not authorized to update this booking.' });
                }

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

                if (booking.userId.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
                }

                await booking.deleteOne();
                res.json({ message: 'Booking cancelled successfully.' });
        } catch (err) {
                console.log("Error canceling booking: ", err);
                res.status(500).json({ message: 'Failed to cancel booking.', error: err });
        }
});

// Get bookings for logged-in user
router.get('/my', authenticateUser, async (req, res) => {
        const bookings = await Booking.find({ userId: req.user._id }).populate('roomId');
        res.json(bookings);
});

// View all bookings (admin only)
router.get('/all', authenticateUser, requireAdmin, async (req, res) => {
        const bookings = await Booking.find().populate('roomId userId');
        res.json(bookings);
});

// Check availability before booking update
router.post('/availability', authenticateUser, async (req, res) => {
        const { roomId, date, timeSlot, bookingId } = req.body;

        if (!roomId || !date || !timeSlot) {
                return res.status(400).json({ available: false, message: 'Missing required fields.' });
        }

        try {
                const existing = await Booking.findOne({
                        roomId,
                        date,
                        timeSlot,
                        _id: { $ne: bookingId } // Exclude current booking if editing
                });

                if (existing) {
                        return res.json({ available: false, message: 'Room is already booked for that slot.' });
                }

                res.json({ available: true });
        } catch (err) {
                console.error('Availability check failed:', err);
                res.status(500).json({ available: false, message: 'Server error checking availability.' });
        }
});

module.exports = router;
