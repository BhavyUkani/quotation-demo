const jwt = require('jsonwebtoken');
const { Employee, Department } = require('../models');

const JWT_SECRET = 'your-secret-key-change-this-in-production';

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user from database
        const employee = await Employee.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }, // Exclude password
            include: [{
                model: Department,
                as: 'department'
            }]
        });

        if (!employee) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = employee;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authMiddleware;
