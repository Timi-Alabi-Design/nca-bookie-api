const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Create a new room (for now: open to all, later: admin only)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
        try {
                const room = await Room.create(req.body);
                res.status(201).json(room);
        } catch (err) {
                res.status(400).json({ message: 'Failed to create room', error: err });
        }
});

// Update a room
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRoom);
});

// Get all rooms
router.get('/', authenticateUser, async (req, res) => {
        const rooms = await Room.find();
        res.json(rooms);
});

// Delete a room
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted successfully.' });
});

module.exports = router;
