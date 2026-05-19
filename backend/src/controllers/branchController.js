const { Branch, Department, Employee, Lead, Client, Package, Quotation, Site, Notification } = require('../models');

// Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            include: [{
                model: Department,
                as: 'departments',
                attributes: ['id']
            }],
            order: [['createdAt', 'DESC']]
        });

        const formattedBranches = branches.map(branch => {
            const b = branch.toJSON();
            b.departmentCount = b.departments ? b.departments.length : 0;
            delete b.departments;
            return b;
        });

        res.json(formattedBranches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new branch
exports.createBranch = async (req, res) => {
    try {
        const branch = await Branch.create(req.body);
        res.status(201).json(branch);
    } catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a branch
exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Branch.update(req.body, {
            where: { id }
        });

        if (updated) {
            const updatedBranch = await Branch.findByPk(id);
            res.json(updatedBranch);
        } else {
            res.status(404).json({ message: 'Branch not found' });
        }
    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a branch
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        // Decouple related entities before deleting branch to avoid FK constraints
        const updateData = { branchId: null };
        const query = { where: { branchId: id } };

        await Promise.all([
            Department.update(updateData, query),
            Employee.update(updateData, query),
            Lead.update(updateData, query),
            Client.update(updateData, query),
            Package.update(updateData, query),
            Quotation.update(updateData, query),
            Site.update(updateData, query),
            Notification.update(updateData, query)
        ]);

        const deleted = await Branch.destroy({
            where: { id }
        });

        if (deleted) {
            res.json({ message: 'Branch deleted successfully' });
        } else {
            res.status(404).json({ message: 'Branch not found' });
        }
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Master's selected branch
exports.updateSelectedBranch = async (req, res) => {
    try {
        const { branchId } = req.body;

        const employeeId = req.user.id; // From authMiddleware

        // Only allow if user is master or admin (could double check here or trust UI/middleware)
        // Updating the user record
        const employee = await require('../models').Employee.findByPk(employeeId);
        if (employee) {
            employee.lastSelectedBranchId = branchId || null;
            await employee.save();
            res.json({ message: 'Selected branch updated', branchId });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error updating selected branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
