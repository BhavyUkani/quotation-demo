const { Employee, Department } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT - In production, use environment variable
const JWT_SECRET = 'your-secret-key-change-this-in-production';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simple validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // In a real application, you should hash passwords and compare hashes
        const employee = await Employee.findOne({
            where: { email },
            include: [{
                model: Department,
                as: 'department'
            }]
        });

        console.log(employee);
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (employee.password !== password) {
            // Check if password matches (handling both plain text legacy and hashed)
            const isMatch = await bcrypt.compare(password, employee.password).catch(() => false);
            if (!isMatch && employee.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Generate JWT token with minimal payload
        const token = jwt.sign(
            {
                id: employee.id,
                email: employee.email
            },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Return token and user data (excluding password)
        const userData = employee.toJSON();
        delete userData.password;

        res.json({
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
