const {
    Quotation,
    Client,
    Employee,
    PackageSpace,
    PackageSpaceWorkItem,
    PackageNote,
    QuotationSpace,
    QuotationSpaceWorkItem,
    QuotationNote,
    QuotationStatusHistory
} = require('../models');
const jwt = require('jsonwebtoken');

// Helper to get user ID from token
const getUserIdFromRequest = (req) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
            return decodedToken.id;
        }
    } catch (e) {
        console.error("Error parsing token:", e);
    }
    return null;
};



// Create quotation
exports.createQuotation = async (req, res) => {
    const t = await require('../config/database').transaction();
    try {
        const { packageId } = req.body;
        let branchId = null;
        let createdBy = req.user?.id;

        // Manual token parsing (legacy/fallback support if no middleware)
        const userId = getUserIdFromRequest(req);
        if (userId) {
            const employee = await Employee.findByPk(userId);
            if (employee) {
                createdBy = employee.id;
                if (employee.isMaster) {
                    branchId = employee.lastSelectedBranchId;
                } else {
                    branchId = employee.branchId;
                }
            }
        }

        const { projectCost, ...quotationData } = req.body;

        const quotation = await Quotation.create({
            ...quotationData,
            // quotationNumber handled by model hook
            createdBy,
            branchId
        }, { transaction: t });

        // Create initial history
        await QuotationStatusHistory.create({
            quotationId: quotation.id,
            previousStatus: null,
            newStatus: 'Draft',
            changedBy: createdBy,
            remarks: 'Initial creation'
        }, { transaction: t });

        // If packageId is provided, copy spaces and work items
        // If packageId is provided, copy spaces, work items AND notes
        if (packageId) {
            // 1. Copy Notes
            const packageNotes = await PackageNote.findAll({
                where: { packageId },
                transaction: t
            });

            if (packageNotes.length > 0) {
                const quotationNotesData = packageNotes.map(pn => ({
                    quotationId: quotation.id,
                    note: pn.note
                }));
                await QuotationNote.bulkCreate(quotationNotesData, { transaction: t });
            }

            // 2. Fetch package spaces with work items
            const packageSpaces = await PackageSpace.findAll({
                where: { packageId },
                include: [{
                    model: PackageSpaceWorkItem,
                    as: 'workItems'
                }],
                transaction: t
            });

            // Iterate and copy spaces
            for (const pSpace of packageSpaces) {
                // ... (rest of space copy logic)
                const qSpace = await QuotationSpace.create({
                    quotationId: quotation.id,
                    name: pSpace.name,
                    order: pSpace.order
                }, { transaction: t });

                // Create QuotationSpaceWorkItems
                if (pSpace.workItems && pSpace.workItems.length > 0) {
                    const qWorkItems = pSpace.workItems.map(item => ({
                        spaceId: qSpace.id,
                        item: item.item,
                        quantity: item.quantity,
                        width: item.width,
                        length: item.length,
                        sqft: item.sqft,
                        rsPerFt: item.rsPerFt,
                        total: item.total,
                        order: item.order
                    }));

                    await QuotationSpaceWorkItem.bulkCreate(qWorkItems, { transaction: t });
                }
            }
        }

        await t.commit();
        res.status(201).json(quotation);
    } catch (error) {
        await t.rollback();
        console.error('Error creating quotation:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get all quotations
// Get all quotations
exports.getAllQuotations = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        const userId = getUserIdFromRequest(req);

        // Filter by branch/user access
        if (userId) {
            try {
                const employee = await Employee.findByPk(userId);
                if (employee) {
                    if (employee.isMaster) {
                        if (employee.lastSelectedBranchId) {
                            whereClause.branchId = employee.lastSelectedBranchId;
                        }
                    } else {
                        whereClause.branchId = employee.branchId;
                    }
                }
            } catch (err) {
                console.error('User verification failed:', err);
            }
        }



        // Search logic
        if (search) {
            whereClause[Op.or] = [
                { quotationNumber: { [Op.like]: `%${search}%` } },
                { projectName: { [Op.like]: `%${search}%` } },
                { '$client.name$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Quotation.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: Employee,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: QuotationStatusHistory,
                    as: 'statusHistory',
                    attributes: ['newStatus', 'createdAt']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true // Important for correct count with includes
        });

        res.json({
            quotations: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching quotations:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get quotation by ID
// Get quotation by ID
exports.getQuotationById = async (req, res) => {
    try {
        const { id } = req.params;
        const quotation = await Quotation.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client'
                },
                {
                    model: Employee,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: QuotationStatusHistory,
                    as: 'statusHistory',
                    include: [{ model: Employee, as: 'changedByUser', attributes: ['name'] }]
                },
                {
                    model: QuotationNote,
                    as: 'quotationNotes',
                    attributes: ['note']
                },
                {
                    model: QuotationSpace,
                    as: 'spaces',
                    include: [{
                        model: QuotationSpaceWorkItem,
                        as: 'workItems'
                    }]
                }
            ]
        });

        if (!quotation) {
            return res.status(404).json({ error: 'Quotation not found' });
        }

        const quotationData = quotation.toJSON();

        // Calculate items total
        let itemsTotal = 0;
        if (quotationData.spaces) {
            quotationData.spaces.forEach(space => {
                if (space.workItems) {
                    space.workItems.forEach(item => {
                        itemsTotal += parseFloat(item.total) || 0;
                    });
                }
            });
        }
        quotationData.itemsTotal = itemsTotal;

        // Transform relational notes to simple array
        if (quotationData.quotationNotes && quotationData.quotationNotes.length > 0) {
            quotationData.notes = quotationData.quotationNotes.map(n => n.note);
        } else {
            quotationData.notes = [];
        }

        // Remove heavy spaces data from response to keep it light if only header is needed?? 
        // User asked for "sum", so we computed it. 
        // We can keep spaces in case frontend needs them later, or remove to match previous payload size. 
        // keeping it is safer.

        res.json(quotationData);
    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update quotation
exports.updateQuotation = async (req, res) => {
    const t = await require('../config/database').transaction();
    try {
        const { id } = req.params;
        const quotation = await Quotation.findByPk(id);

        if (!quotation) {
            await t.rollback();
            return res.status(404).json({ error: 'Quotation not found' });
        }

        // Check if status is being updated
        if (req.body.status && req.body.status !== quotation.status) {
            const userId = getUserIdFromRequest(req);
            await QuotationStatusHistory.create({
                quotationId: quotation.id,
                previousStatus: quotation.status,
                newStatus: req.body.status,
                changedBy: userId,
                remarks: 'Status updated via general update'
            }, { transaction: t });
        }

        if (req.body.notes !== undefined) {
            const notes = req.body.notes;
            // Remove existing notes
            await QuotationNote.destroy({
                where: { quotationId: quotation.id },
                transaction: t
            });

            // Add new notes
            let notesToCreate = [];
            if (Array.isArray(notes)) {
                notesToCreate = notes.filter(n => n && typeof n === 'string' && n.trim().length > 0)
                    .map(n => ({ quotationId: quotation.id, note: n }));
            }

            if (notesToCreate.length > 0) {
                await QuotationNote.bulkCreate(notesToCreate, { transaction: t });
            }
        }

        // Handle Package Change: Overwrite spaces and work items if packageId changes
        if (req.body.packageId && req.body.packageId !== quotation.packageId) {
            const newPackageId = req.body.packageId;

            // 1. Delete existing Quotation Spaces and Work Items and Notes (Clean slate for new package)
            // Note: Deleting QuotationSpace should cascade delete QuotationSpaceWorkItem if set up in DB, 
            // but for safety/explicitness we can fetch spaces first or rely on model cascade. 
            // Assuming we need to manually clean up if cascade isn't guaranteed:

            // Find all spaces first to delete their items (if manual delete needed)
            // Or just delete spaces if cascade is on. Let's assume we need to be thorough or rely on stored logic.
            // Simpler approach: 
            // Delete all Work Items for this quotation's spaces (Complex query without association loaded)
            // Better: Delete notes first (already done or needs re-doing if package has notes)

            // Re-delete notes if package change is detected to overwrite with package notes instead?
            // The requirement says "copy that package space and work item". It implies package structure.
            // Usually package change implies reset of structure.

            // Delete existing Spaces (and cascade items ideally)
            // We need to fetch spaces to delete items? Or use delete with include.
            // To be safe, we will fetch spaces ids to delete items.
            const existingSpaces = await QuotationSpace.findAll({
                where: { quotationId: quotation.id },
                attributes: ['id'],
                transaction: t
            });
            const existingSpaceIds = existingSpaces.map(s => s.id);

            if (existingSpaceIds.length > 0) {
                await QuotationSpaceWorkItem.destroy({
                    where: { spaceId: existingSpaceIds },
                    transaction: t
                });
                await QuotationSpace.destroy({
                    where: { id: existingSpaceIds },
                    transaction: t
                });
            }

            // Also overwrite notes from package if package changes? 
            // Usually yes.
            await QuotationNote.destroy({
                where: { quotationId: quotation.id },
                transaction: t
            });

            // 2. Fetch new package details
            const packageNotes = await PackageNote.findAll({
                where: { packageId: newPackageId },
                transaction: t
            });

            if (packageNotes.length > 0) {
                const quotationNotesData = packageNotes.map(pn => ({
                    quotationId: quotation.id,
                    note: pn.note
                }));
                await QuotationNote.bulkCreate(quotationNotesData, { transaction: t });
            }

            const packageSpaces = await PackageSpace.findAll({
                where: { packageId: newPackageId },
                include: [{
                    model: PackageSpaceWorkItem,
                    as: 'workItems'
                }],
                transaction: t
            });

            // 3. Copy new package structure
            for (const pSpace of packageSpaces) {
                const qSpace = await QuotationSpace.create({
                    quotationId: quotation.id,
                    name: pSpace.name,
                    order: pSpace.order
                }, { transaction: t });

                if (pSpace.workItems && pSpace.workItems.length > 0) {
                    const qWorkItems = pSpace.workItems.map(item => ({
                        spaceId: qSpace.id,
                        item: item.item,
                        quantity: item.quantity,
                        width: item.width,
                        length: item.length,
                        sqft: item.sqft,
                        rsPerFt: item.rsPerFt,
                        total: item.total,
                        order: item.order
                    }));

                    await QuotationSpaceWorkItem.bulkCreate(qWorkItems, { transaction: t });
                }
            }
        }

        const { projectCost, ...updateData } = req.body;
        await quotation.update(updateData, { transaction: t });
        await t.commit();
        res.json(quotation);
    } catch (error) {
        await t.rollback();
        console.error('Error updating quotation:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const { id } = req.params;
        const quotation = await Quotation.findByPk(id);

        if (!quotation) {
            return res.status(404).json({ error: 'Quotation not found' });
        }

        await quotation.destroy();
        res.json({ message: 'Quotation deleted successfully' });
    } catch (error) {
        console.error('Error deleting quotation:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update quotation status
exports.updateQuotationStatus = async (req, res) => {
    const t = await require('../config/database').transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;

        const quotation = await Quotation.findByPk(id);

        if (!quotation) {
            await t.rollback();
            return res.status(404).json({ error: 'Quotation not found' });
        }

        if (quotation.status !== status) {
            const userId = getUserIdFromRequest(req);

            await QuotationStatusHistory.create({
                quotationId: quotation.id,
                previousStatus: quotation.status,
                newStatus: status,
                changedBy: userId,
                remarks: 'Status updated via API'
            }, { transaction: t });

            await quotation.update({ status }, { transaction: t });
        }

        await t.commit();
        res.json(quotation);
    } catch (error) {
        await t.rollback();
        console.error('Error updating quotation status:', error);
        res.status(400).json({ error: error.message });
    }
};

// Copy quotation
exports.copyQuotation = async (req, res) => {
    const t = await require('../config/database').transaction();
    try {
        const { id } = req.params;
        const originalQuotation = await Quotation.findByPk(id);

        if (!originalQuotation) {
            await t.rollback();
            return res.status(404).json({ error: 'Quotation not found' });
        }

        // Generate new quotation number - handled by model hook
        // const quotationNumber = await generateQuotationNumber();

        // Determine createdBy and branchId
        let branchId = originalQuotation.branchId;
        let createdBy = req.user?.id;

        const userId = getUserIdFromRequest(req);
        if (userId) {
            const employee = await Employee.findByPk(userId);
            if (employee) {
                createdBy = employee.id;
                if (employee.isMaster) {
                    branchId = employee.lastSelectedBranchId || branchId;
                } else {
                    branchId = employee.branchId;
                }
            }
        }

        // Generate suffixed quotation number for duplicate
        const { Op } = require('sequelize');
        let baseQuotationNumber = originalQuotation.quotationNumber;

        // If original is already a copy (e.g. ...-0004_1), strip suffix to get base (...-0004)
        if (baseQuotationNumber.includes('_')) {
            baseQuotationNumber = baseQuotationNumber.split('_')[0];
        }

        // Find all quotations sharing this base number
        const similarQuotations = await Quotation.findAll({
            where: {
                quotationNumber: {
                    [Op.like]: `${baseQuotationNumber}%`
                }
            },
            attributes: ['quotationNumber'],
            paranoid: false
        });

        let maxSuffix = 0;
        similarQuotations.forEach(q => {
            if (q.quotationNumber === baseQuotationNumber) return;
            // Check if it matches pattern base_suffix
            if (q.quotationNumber.startsWith(baseQuotationNumber + '_')) {
                const parts = q.quotationNumber.split('_');
                const suffix = parseInt(parts[parts.length - 1]);
                if (!isNaN(suffix) && suffix > maxSuffix) {
                    maxSuffix = suffix;
                }
            }
        });

        const newQuotationNumber = `${baseQuotationNumber}_${maxSuffix + 1}`;

        // Create new quotation shell
        const newQuotation = await Quotation.create({
            quotationNumber: newQuotationNumber,
            clientId: originalQuotation.clientId,
            packageId: originalQuotation.packageId,
            projectName: originalQuotation.projectName,
            area: originalQuotation.area,
            validFrom: new Date(),
            validTo: new Date(new Date().setDate(new Date().getDate() + 30)), // Default 30 days validity
            discountPercentage: originalQuotation.discountPercentage,
            totalCost: originalQuotation.totalCost,
            salesPersonName: originalQuotation.salesPersonName,
            salesPersonMobile: originalQuotation.salesPersonMobile,
            status: 'Draft',
            remarks: originalQuotation.remarks,
            branchId,
            createdBy
        }, { transaction: t });

        // Create initial history
        await QuotationStatusHistory.create({
            quotationId: newQuotation.id,
            previousStatus: null,
            newStatus: 'Draft',
            changedBy: createdBy,
            remarks: 'Created via duplication'
        }, { transaction: t });

        // Copy Spaces and Items
        const originalSpaces = await QuotationSpace.findAll({
            where: { quotationId: originalQuotation.id },
            include: [{
                model: QuotationSpaceWorkItem,
                as: 'workItems'
            }]
        });

        for (const pSpace of originalSpaces) {
            // Create QuotationSpace
            const qSpace = await QuotationSpace.create({
                quotationId: newQuotation.id,
                name: pSpace.name,
                order: pSpace.order
            }, { transaction: t });

            // Create QuotationSpaceWorkItems
            if (pSpace.workItems && pSpace.workItems.length > 0) {
                const qWorkItems = pSpace.workItems.map(item => ({
                    spaceId: qSpace.id,
                    item: item.item,
                    quantity: item.quantity,
                    width: item.width,
                    length: item.length,
                    sqft: item.sqft,
                    rsPerFt: item.rsPerFt,
                    total: item.total,
                    order: item.order
                }));

                await QuotationSpaceWorkItem.bulkCreate(qWorkItems, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json(newQuotation);
    } catch (error) {
        await t.rollback();
        console.error('Error copying quotation:', error);
        res.status(500).json({ error: error.message });
    }
};
