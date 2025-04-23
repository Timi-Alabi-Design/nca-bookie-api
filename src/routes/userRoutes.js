const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Promote a user to admin (admin-only)
// Promote a user to admin via email (admin-only)
router.put('/promote-by-email', authenticateUser, requireAdmin, async (req, res) => {
        const { email } = req.body;

        try {
                const user = await User.findOneAndUpdate(
                        { email },
                        { role: 'admin' },
                        { new: true }
                );

                if (!user) return res.status(404).json({ message: 'User not found.' });

                res.json({
                        message: `User ${user.name} promoted to admin.`,
                        user: { id: user._id, name: user.name, email: user.email, role: user.role }
                });
        } catch (err) {
                res.status(500).json({ message: 'Promotion failed.', error: err });
        }
});


module.exports = router;
