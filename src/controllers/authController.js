const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
        try {
                console.log('ROUTE HIT')
                const { name, email, password } = req.body;

                // Check if user exists
                const existingUser = await User.findOne({ email });
                if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const newUser = await User.create({ name, email, password: hashedPassword });
                res.status(201).json({ message: 'User registered successfully.' });

        } catch (error) {
                res.status(500).json({ message: 'Something went wrong.', error });
        }
};

exports.login = async (req, res) => {
        try {
                const { email, password } = req.body;

                // Find user
                const user = await User.findOne({ email });
                if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

                // Sign token
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

                res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

        } catch (error) {
                res.status(500).json({ message: 'Something went wrong.', error });
        }
};
