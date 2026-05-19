const { QuotationSpace, QuotationSpaceWorkItem, Quotation } = require('../models');

const recalculateQuotationTotal = async (quotationId) => {
    try {
        const spaces = await QuotationSpace.findAll({
            where: { quotationId },
            include: [{
                model: QuotationSpaceWorkItem,
                as: 'workItems',
                attributes: ['total']
            }]
        });

        let itemsTotal = 0;
        spaces.forEach(space => {
            if (space.workItems) {
                space.workItems.forEach(item => {
                    itemsTotal += parseFloat(item.total) || 0;
                });
            }
        });

        const quotation = await Quotation.findByPk(quotationId);
        if (quotation) {
            const discount = parseFloat(quotation.discountPercentage) || 0;
            const finalTotal = itemsTotal - (itemsTotal * discount / 100);
            // We do not set projectCost because it's removed from model
            await quotation.update({ totalCost: finalTotal });
        }
    } catch (err) {
        console.error('Error recalculating quotation total:', err);
    }
};

// Get all spaces for a quotation
exports.getQuotationSpaces = async (req, res) => {
    try {
        const { quotationId } = req.params;

        const spaces = await QuotationSpace.findAll({
            where: { quotationId },
            include: [{
                model: QuotationSpaceWorkItem,
                as: 'workItems'
            }],
            order: [
                ['order', 'ASC'],
                [{ model: QuotationSpaceWorkItem, as: 'workItems' }, 'order', 'ASC']
            ]
        });

        res.json(spaces);
    } catch (error) {
        console.error('Error fetching quotation spaces:', error);
        res.status(500).json({ message: 'Error fetching quotation spaces', error: error.message });
    }
};

// Create a new space for a quotation
exports.createQuotationSpace = async (req, res) => {
    try {
        const { quotationId } = req.params;
        const { name, order } = req.body;

        // Verify quotation exists
        const quotationExists = await Quotation.findByPk(quotationId);
        if (!quotationExists) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        const space = await QuotationSpace.create({
            quotationId,
            name,
            order: order || 0
        });

        res.status(201).json(space);
    } catch (error) {
        console.error('Error creating quotation space:', error);
        res.status(500).json({ message: 'Error creating quotation space', error: error.message });
    }
};

// Update a space
exports.updateQuotationSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, order } = req.body;

        const space = await QuotationSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        await space.update({ name, order });
        res.json(space);
    } catch (error) {
        console.error('Error updating quotation space:', error);
        res.status(500).json({ message: 'Error updating quotation space', error: error.message });
    }
};

// Delete a space
exports.deleteQuotationSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await QuotationSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        const quotationId = space.quotationId;
        await space.destroy();
        await recalculateQuotationTotal(quotationId);
        res.json({ message: 'Space deleted successfully' });
    } catch (error) {
        console.error('Error deleting quotation space:', error);
        res.status(500).json({ message: 'Error deleting quotation space', error: error.message });
    }
};

// Add work item to a space
exports.addWorkItem = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { item, quantity, width, length, sqft, rsPerFt, total, order } = req.body;

        // Verify space exists
        const space = await QuotationSpace.findByPk(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        const workItem = await QuotationSpaceWorkItem.create({
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
        // Recalculate total
        await recalculateQuotationTotal(space.quotationId);
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

        const workItem = await QuotationSpaceWorkItem.findByPk(workItemId, {
            include: [{ model: QuotationSpace, as: 'space' }]
        });
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

        if (workItem.space) {
            await recalculateQuotationTotal(workItem.space.quotationId);
        }
    } catch (error) {
        console.error('Error updating work item:', error);
        res.status(500).json({ message: 'Error updating work item', error: error.message });
    }
};

// Delete work item
exports.deleteWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.params;

        const workItem = await QuotationSpaceWorkItem.findByPk(workItemId, {
            include: [{ model: QuotationSpace, as: 'space' }]
        });
        if (!workItem) {
            return res.status(404).json({ message: 'Work item not found' });
        }

        const quotationId = workItem.space ? workItem.space.quotationId : null;
        await workItem.destroy();
        if (quotationId) {
            await recalculateQuotationTotal(quotationId);
        }
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
            QuotationSpaceWorkItem.update(
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
