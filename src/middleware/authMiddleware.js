const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
        const authHeader = req.headers.authorization;

        // Check if token is present
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Authorization token missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];

        try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded; // Attach user data to request
                next();
        } catch (err) {
                return res.status(401).json({ message: 'Token is invalid or expired.' });
        }
};

module.exports = authenticateUser;
