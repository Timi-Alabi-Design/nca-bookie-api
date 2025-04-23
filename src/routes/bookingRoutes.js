const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

router.get('/protected', authenticateUser, (req, res) => {
        res.json({ message: `Hello, ${req.user.userId}. You have access.` });
});

module.exports = router;
