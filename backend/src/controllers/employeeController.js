const { Employee, Department, Branch } = require('../models');
const notificationController = require('./notificationController');
const jwt = require('jsonwebtoken');
const { getBranchIdFromToken } = require('../utils/branch.helper');

exports.createEmployee = async (req, res) => {
    try {
        const payload = { ...req.body };
        // Handle empty strings for foreign keys
        if (payload.departmentId === '') payload.departmentId = null;

        // Auto-assign branch context
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const branchId = await getBranchIdFromToken(token);
            if (branchId) {
                payload.branchId = branchId;
            }
        } else {
            if (payload.branchId === '') payload.branchId = null;
        }

        const employee = await Employee.create(payload);

        // Create notification
        await notificationController.createNotification(
            'employee_created',
            'New Employee Added',
            `A new employee "${employee.name}" has been added to the system.`,
            employee.id,
            'employee',
            req.user?.id, // Note: notificationController also uses branch logic internally now, but passing user helps
        );

        res.status(201).json(employee);
    } catch (error) {
        console.error("Create Employee Error:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const whereClause = {};
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
                    const employee = await Employee.findByPk(decodedToken.id);

                    if (employee) {
                        if (employee.isMaster) {
                            if (employee.lastSelectedBranchId) {
                                whereClause.branchId = employee.lastSelectedBranchId;
                            }
                        } else {
                            // Regular employees see their branch colleagues
                            whereClause.branchId = employee.branchId;
                        }
                    }
                } catch (err) {
                    console.error('Token verification failed:', err);
                }
            }
        }

        const employees = await Employee.findAll({
            where: whereClause,
            include: [{
                model: Department,
                as: 'department'
            }, {
                model: Branch,
                as: 'branch'
            }]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = { ...req.body };

        // Handle empty strings for foreign keys
        if (payload.departmentId === '') payload.departmentId = null;
        if (payload.branchId === '') payload.branchId = null;

        // Check if password is being changed
        const oldEmployee = await Employee.findByPk(id);
        if (!oldEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const isPasswordChanged = payload.password && payload.password !== oldEmployee.password;

        const [updated] = await Employee.update(payload, { where: { id } });

        if (updated) {
            const updatedEmployee = await Employee.findByPk(id);

            // Create notification if password was changed
            if (isPasswordChanged) {
                await notificationController.createNotification(
                    'employee_password_changed',
                    'Employee Password Changed',
                    `Password for employee "${updatedEmployee.name}" has been changed.`,
                    updatedEmployee.id,
                    'employee',
                    req.user?.id
                );
            }

            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
