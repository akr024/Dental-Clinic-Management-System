const jwt = require('jsonwebtoken');

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

module.exports = { generateToken, verifyToken };
