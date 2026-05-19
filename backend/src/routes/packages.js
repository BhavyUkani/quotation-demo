const express = require('express');
const router = express.Router();
const { Package, Employee, PackageNote, PackageSpace, PackageSpaceWorkItem } = require('../models');
const jwt = require('jsonwebtoken');

// Helper to calculate total price
// Helper to calculate total price
const calculatePackagePrice = (pkg) => {
    if (pkg.costType === 'Fixed') {
        return `₹ ${(parseFloat(pkg.fixedCost) || 0).toLocaleString('en-IN')}`;
    }

    let total = 0;
    if (pkg.spaces) {
        pkg.spaces.forEach(space => {
            if (space.workItems) {
                space.workItems.forEach(item => {
                    const itemTotal = parseFloat(item.total) || 0;
                    total += itemTotal;
                });
            }
        });
    }
    return `₹ ${total.toLocaleString('en-IN')}`;
};

// Get all packages
// Get all packages
router.get('/', async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const { page = 1, limit = 10, search = '', category = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
                    const id = decodedToken.id;
                    const employee = await Employee.findByPk(id);

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
                    console.error('Token verification failed:', err);
                }
            }
        }

        // Category Filter
        if (category && category !== 'all') {
            whereClause.category = category;
        }

        // Search Filter
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { type: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Package.findAndCountAll({
            where: whereClause,
            include: [{
                model: PackageSpace,
                as: 'spaces',
                include: [{
                    model: PackageSpaceWorkItem,
                    as: 'workItems'
                }]
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        const packagesWithPrice = rows.map(pkg => {
            const pkgData = pkg.toJSON();
            pkgData.price = calculatePackagePrice(pkgData);
            return pkgData;
        });

        res.json({
            packages: packagesWithPrice,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
});

// Get single package by ID
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id, {
            include: [
                {
                    model: PackageNote,
                    as: 'packageNotes',
                    attributes: ['note']
                },
                {
                    model: PackageSpace,
                    as: 'spaces',
                    include: [{
                        model: PackageSpaceWorkItem,
                        as: 'workItems'
                    }]
                }
            ]
        });
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        const pkgData = pkg.toJSON();

        // Calculate price
        pkgData.price = calculatePackagePrice(pkgData);

        // Transform relational notes to simple array for frontend compatibility
        if (pkgData.packageNotes && pkgData.packageNotes.length > 0) {
            pkgData.notes = pkgData.packageNotes.map(n => n.note);
        } else if (typeof pkgData.notes === 'string') {
            // Fallback for potential legacy data still in the text column
            try {
                const parsed = JSON.parse(pkgData.notes);
                if (Array.isArray(parsed)) pkgData.notes = parsed;
            } catch (e) { }
        }

        res.json(pkgData);
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({ error: 'Failed to fetch package' });
    }
});

// Create new package
router.post('/', async (req, res) => {
    try {
        const { type, category, description, features, notes, costType, fixedCost } = req.body;
        let branchId = null;
        let employeeId = null;

        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
                const employee = await Employee.findByPk(decodedToken.id);
                if (employee) {
                    employeeId = employee.id;
                    if (employee.isMaster) {
                        branchId = employee.lastSelectedBranchId;
                    } else {
                        branchId = employee.branchId;
                    }
                }
            } catch (e) {
                console.error("Auth error in create package:", e);
            }
        }

        // Auto-generate name from type and category
        const name = `${type} ${category}`;

        // Prepare PackageNote data
        let packageNotesData = [];
        if (Array.isArray(notes)) {
            packageNotesData = notes.map(n => ({ note: n }));
        } else if (typeof notes === 'string') {
            try {
                const parsed = JSON.parse(notes);
                if (Array.isArray(parsed)) packageNotesData = parsed.map(n => ({ note: n }));
                else if (notes.trim()) packageNotesData.push({ note: notes });
            } catch (e) {
                if (notes && notes.trim()) packageNotesData.push({ note: notes });
            }
        }

        const newPackage = await Package.create({
            name,
            type,
            category,
            description,
            features,
            costType: costType || 'Calculated',
            fixedCost: fixedCost || null,
            // notes: notesString, // Deprecated in favor of relation
            packageNotes: packageNotesData,
            branchId,
            employeeId
        }, {
            include: [{ model: PackageNote, as: 'packageNotes' }]
        });

        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

// Update package
router.put('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        const { type, category, description, features, notes, costType, fixedCost } = req.body;

        // Auto-generate name from type and category
        const name = `${type} ${category}`;

        await pkg.update({
            name,
            type,
            category,
            description,
            description,
            features,
            costType: costType || 'Calculated',
            fixedCost: fixedCost || null,
            // notes: notesString // Deprecated
        });

        // Sync PackageNotes if provided
        if (notes !== undefined) {
            await PackageNote.destroy({ where: { packageId: req.params.id } });

            let notesToCreate = [];
            if (Array.isArray(notes)) {
                // Filter out empty strings just in case
                notesToCreate = notes.filter(n => n && typeof n === 'string' && n.trim().length > 0)
                    .map(n => ({ packageId: req.params.id, note: n }));
            } else if (typeof notes === 'string') {
                try {
                    const parsed = JSON.parse(notes);
                    if (Array.isArray(parsed)) {
                        notesToCreate = parsed.filter(n => n && typeof n === 'string' && n.trim().length > 0)
                            .map(n => ({ packageId: req.params.id, note: n }));
                    } else if (notes.trim()) {
                        notesToCreate.push({ packageId: req.params.id, note: notes });
                    }
                } catch (e) {
                    if (notes.trim()) notesToCreate.push({ packageId: req.params.id, note: notes });
                }
            }

            if (notesToCreate.length > 0) {
                await PackageNote.bulkCreate(notesToCreate);
            }
        }

        res.json(pkg);
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ error: 'Failed to update package' });
    }
});

// Delete package
router.delete('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        await pkg.destroy();
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ error: 'Failed to delete package' });
    }
});

module.exports = router;
