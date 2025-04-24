const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Create a new room (admin only)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
        try {
                const room = await Room.create(req.body);
                res.status(201).json(room);
        } catch (err) {
                console.error('Error creating room:', err);
                res.status(400).json({ message: 'Failed to create room.', error: err });
        }
});

// Update a room by ID
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
        try {
                const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true,
                });

                if (!updatedRoom) {
                        return res.status(404).json({ message: 'Room not found.' });
                }

                res.json(updatedRoom);
        } catch (err) {
                console.error('Error updating room:', err);
                res.status(400).json({ message: 'Failed to update room.', error: err });
        }
});

// Get all rooms (auth required)
router.get('/', authenticateUser, async (req, res) => {
        console.log("Get and Manage All Rooms")
        try {
                const rooms = await Room.find();
                res.json(rooms);
        } catch (err) {
                console.error('Error fetching rooms:', err);
                res.status(500).json({ message: 'Failed to fetch rooms.', error: err });
        }
});

// Delete a room by ID
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
        try {
                const room = await Room.findByIdAndDelete(req.params.id);
                if (!room) {
                        return res.status(404).json({ message: 'Room not found.' });
                }

                res.json({ message: 'Room deleted successfully.' });
        } catch (err) {
                console.error('Error deleting room:', err);
                res.status(500).json({ message: 'Failed to delete room.', error: err });
        }
});

module.exports = router;
