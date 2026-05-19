const { Department, Employee } = require('../models');
const jwt = require('jsonwebtoken');
const { getBranchIdFromToken } = require('../utils/branch.helper');

exports.createDepartment = async (req, res) => {
    try {
        const branchId = await getBranchIdFromToken(req.headers.authorization.split(' ')[1]);


        const department = await Department.create({
            ...req.body,
            branchId
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllDepartments = async (req, res) => {
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
        const departments = await Department.findAll({
            where: whereClause,
            include: [{
                model: Employee,
                as: 'employees',
                attributes: ['id'] // To count them on frontend or we can use sequelize count
            }]
        });
        // Add employeeCount property
        const formattedDepts = departments.map(dept => {
            const d = dept.toJSON();
            d.employeeCount = d.employees ? d.employees.length : 0;

            return d;
        });
        res.json(formattedDepts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Department.update(req.body, { where: { id } });
        if (updated) {
            const updatedDepartment = await Department.findByPk(id);
            res.json(updatedDepartment);
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Department.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
