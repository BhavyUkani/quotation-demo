
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const getBranchIdFromToken = async (token, employeeId = false) => {
    let employee;
    try {
        const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
        employee = await Employee.findByPk(decodedToken.id);
        if (employee) {
            if (employee.isMaster) {
                branchId = employee.lastSelectedBranchId;
            } else {
                branchId = employee.branchId;
            }
        }
    } catch (e) {
        console.error("Auth error in create department:", e);
    }
    if (employeeId) {
        return employee.dataValues;
    } else {
        return branchId;
    }
}

exports.getBranchIdFromToken = getBranchIdFromToken;