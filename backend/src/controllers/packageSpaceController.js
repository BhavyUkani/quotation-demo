const { PackageSpace, PackageSpaceWorkItem, Package } = require('../models');

// Get all spaces for a package
exports.getPackageSpaces = async (req, res) => {
    try {
        const { packageId } = req.params;

        const spaces = await PackageSpace.findAll({
            where: { packageId },
            include: [{
                model: PackageSpaceWorkItem,
                as: 'workItems'
            }],
            order: [
                ['order', 'ASC'],
                [{ model: PackageSpaceWorkItem, as: 'workItems' }, 'order', 'ASC']
            ]
        });

        res.json(spaces);
    } catch (error) {
        console.error('Error fetching package spaces:', error);
        res.status(500).json({ message: 'Error fetching package spaces', error: error.message });
    }
};

// Create a new space for a package
exports.createPackageSpace = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { name, order } = req.body;

        // Verify package exists
        const packageExists = await Package.findByPk(packageId);
        if (!packageExists) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const space = await PackageSpace.create({
            packageId,
            name,
            order: order || 0
        });

        res.status(201).json(space);
    } catch (error) {
        console.error('Error creating package space:', error);
        res.status(500).json({ message: 'Error creating package space', error: error.message });
    }
};

// Update a space
exports.updatePackageSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, order } = req.body;

        const space = await PackageSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        await space.update({ name, order });
        res.json(space);
    } catch (error) {
        console.error('Error updating package space:', error);
        res.status(500).json({ message: 'Error updating package space', error: error.message });
    }
};

// Delete a space
exports.deletePackageSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await PackageSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        await space.destroy();
        res.json({ message: 'Space deleted successfully' });
    } catch (error) {
        console.error('Error deleting package space:', error);
        res.status(500).json({ message: 'Error deleting package space', error: error.message });
    }
};

// Add work item to a space
exports.addWorkItem = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { item, quantity, width, length, sqft, rsPerFt, total, order } = req.body;

        // Verify space exists
        const space = await PackageSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        const workItem = await PackageSpaceWorkItem.create({
            spaceId,
            item,
            quantity,
            width,
            length,
            sqft,
            rsPerFt,
            total,
            order: order || 0
        });

        res.status(201).json(workItem);
    } catch (error) {
        console.error('Error adding work item:', error);
        res.status(500).json({ message: 'Error adding work item', error: error.message });
    }
};

// Update work item
exports.updateWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.params;
        const { item, quantity, width, length, sqft, rsPerFt, total, order } = req.body;

        const workItem = await PackageSpaceWorkItem.findByPk(workItemId);
        if (!workItem) {
            return res.status(404).json({ message: 'Work item not found' });
        }

        await workItem.update({
            item,
            quantity,
            width,
            length,
            sqft,
            rsPerFt,
            total,
            order
        });

        res.json(workItem);
    } catch (error) {
        console.error('Error updating work item:', error);
        res.status(500).json({ message: 'Error updating work item', error: error.message });
    }
};

// Delete work item
exports.deleteWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.params;

        const workItem = await PackageSpaceWorkItem.findByPk(workItemId);
        if (!workItem) {
            return res.status(404).json({ message: 'Work item not found' });
        }

        await workItem.destroy();
        res.json({ message: 'Work item deleted successfully' });
    } catch (error) {
        console.error('Error deleting work item:', error);
        res.status(500).json({ message: 'Error deleting work item', error: error.message });
    }
};

// Bulk update work items (for reordering)
exports.bulkUpdateWorkItems = async (req, res) => {
    try {
        const { workItems } = req.body;

        if (!Array.isArray(workItems)) {
            return res.status(400).json({ message: 'workItems must be an array' });
        }

        // Update each work item
        const updatePromises = workItems.map(item =>
            PackageSpaceWorkItem.update(
                {
                    item: item.item,
                    quantity: item.quantity,
                    width: item.width,
                    length: item.length,
                    sqft: item.sqft,
                    rsPerFt: item.rsPerFt,
                    total: item.total,
                    order: item.order
                },
                { where: { id: item.id } }
            )
        );

        await Promise.all(updatePromises);
        res.json({ message: 'Work items updated successfully' });
    } catch (error) {
        console.error('Error bulk updating work items:', error);
        res.status(500).json({ message: 'Error bulk updating work items', error: error.message });
    }
};
