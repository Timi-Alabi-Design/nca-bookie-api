const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const authenticateUser = require('../middleware/authMiddleware');

// Create a new room (for now: open to all, later: admin only)
router.post('/', authenticateUser, async (req, res) => {
        try {
                const room = await Room.create(req.body);
                res.status(201).json(room);
        } catch (err) {
                res.status(400).json({ message: 'Failed to create room', error: err });
        }
});

// Get all rooms
router.get('/', authenticateUser, async (req, res) => {
        const rooms = await Room.find();
        res.json(rooms);
});

module.exports = router;
