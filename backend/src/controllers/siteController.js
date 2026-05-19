const { Site, Employee, sequelize, Quotation, Client, SiteMaterial } = require('../models');
const jwt = require('jsonwebtoken');
const { getBranchIdFromToken } = require('../utils/branch.helper');

// Get all sites
// Get all sites
exports.getAllSites = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

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
                            whereClause.branchId = employee.branchId;
                        }
                    }
                } catch (err) {
                    console.error('Token verification failed:', err);
                }
            }
        }

        // Status Filter
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        // Search Filter
        if (search) {
            whereClause[Op.or] = [
                { clientName: { [Op.like]: `%${search}%` } },
                { projectName: { [Op.like]: `%${search}%` } },
                { supervisorName: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Site.findAndCountAll({
            where: whereClause,
            include: [{
                model: SiteMaterial,
                as: 'materials',
                attributes: ['cost']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        const sitesWithExpense = rows.map(site => {
            const siteJson = site.toJSON();
            const totalExpense = siteJson.materials
                ? siteJson.materials.reduce((sum, material) => sum + (material.cost || 0), 0)
                : 0;
            return {
                ...siteJson,
                totalExpense
            };
        });

        res.status(200).json({
            sites: sitesWithExpense,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({ message: 'Server error fetching sites' });
    }
};

// Get site by ID
exports.getSiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const site = await Site.findByPk(id);

        if (site) {
            res.status(200).json(site);
        } else {
            res.status(404).json({ message: 'Site not found' });
        }
    } catch (error) {
        console.error('Error fetching site:', error);
        res.status(500).json({ message: 'Server error fetching site' });
    }
};

exports.createSite = async (req, res) => {
    try {
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
                console.error("Auth error in create site:", e);
            }
        }

        const site = await Site.create({
            ...req.body,
            branchId,
            employeeId
        });
        res.status(201).json(site);
    } catch (error) {
        console.error('Error creating site:', error);
        res.status(500).json({ message: 'Server error creating site' });
    }
};

exports.createSiteFromQuotation = async (req, res) => {
    console.log(req.body);
    const branchId = await getBranchIdFromToken(req.headers.authorization.split(' ')[1]);
    console.log(branchId)
    try {
        const transaction = await sequelize.transaction();
        const quotationId = req.body.quotationId;

        // include client in quotation query
        const quotation = await Quotation.findByPk(quotationId, {
            include: [
                { model: Client, as: 'client' }
            ]
        });

        const site = await Site.create({
            clientName: quotation.client.name,
            projectName: quotation.projectName,
            supervisorName: req.body.supervisorName,
            address: quotation.client.address,
            status: 'Active',
            branchId: branchId,
        }, { transaction });
        await transaction.commit();
        console.log(quotation);

        res.status(201).json({});
    } catch (error) {
        console.error('Error creating site:', error);
        res.status(500).json({ message: 'Server error creating site' });
    }
};

// Update a site
exports.updateSite = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Site.update(req.body, {
            where: { id }
        });

        if (updated) {
            const updatedSite = await Site.findByPk(id);
            res.status(200).json(updatedSite);
        } else {
            res.status(404).json({ message: 'Site not found' });
        }
    } catch (error) {
        console.error('Error updating site:', error);
        res.status(500).json({ message: 'Server error updating site' });
    }
};

// Delete a site
exports.deleteSite = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Site.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Site deleted successfully' });
        } else {
            res.status(404).json({ message: 'Site not found' });
        }
    } catch (error) {
        console.error('Error deleting site:', error);
        res.status(500).json({ message: 'Server error deleting site' });
    }
};