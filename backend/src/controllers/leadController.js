const { Lead, LeadStatusHistory, Client, Employee } = require('../models');
const sequelize = require('../config/database');
const notificationController = require('./notificationController');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { getBranchIdFromToken } = require('../utils/branch.helper');

const JWT_SECRET = "your-secret-key-change-this-in-production";

exports.createLead = async (req, res) => {
    try {
        const leadData = { ...req.body };
        const employee = await getBranchIdFromToken(req.headers.authorization.split(' ')[1], true);

        // Track creator
        leadData.addedByEmployeeId = employee.id;

        // Default assignment to self if not provided
        if (!leadData.assignedToEmployeeId) {
            leadData.assignedToEmployeeId = employee.id;
        }

        if (employee.isMaster) {
            leadData.branchId = employee.lastSelectedBranchId || employee.branchId;
        } else {
            leadData.branchId = employee.branchId;
        }

        const lead = await Lead.create(leadData);

        await LeadStatusHistory.create({
            leadId: lead.id,
            fromStatus: null,
            toStatus: lead.status
        });

        await notificationController.createNotification(
            'lead_created',
            'New Lead Received',
            `A new lead "${lead.name}" has been added by ${employee.name}.`,
            lead.id,
            'lead',
            employee.id
        );

        res.status(201).json(lead);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllLeads = async (req, res) => {
    try {
        const whereClause = {};
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const id = decodedToken.id;

        // Pagination and Filtering Parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const status = req.query.status || 'all';

        const employee = await Employee.findByPk(id);
        if (employee) {
            if (employee.isMaster) {
                if (employee.lastSelectedBranchId) {
                    whereClause.branchId = employee.lastSelectedBranchId;
                }
            } else {
                whereClause.branchId = employee.branchId;
                // Show leads added by OR assigned to this employee
                whereClause[Op.or] = [
                    { addedByEmployeeId: id },
                    { assignedToEmployeeId: id }
                ];
            }
        }

        // Apply Search Filter
        if (search) {
            const searchCreate = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            };

            // Allow searching within the branch/employee constraints
            if (whereClause[Op.or]) {
                whereClause[Op.and] = [
                    searchCreate,
                    { [Op.or]: whereClause[Op.or] }
                ];
                delete whereClause[Op.or];
            } else {
                Object.assign(whereClause, searchCreate);
            }
        }

        // Apply Status Filter
        if (status !== 'all') {
            whereClause.status = status;
        }

        const { count, rows } = await Lead.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: LeadStatusHistory,
                    as: 'statusHistory'
                },
                {
                    model: Employee,
                    as: 'addedBy',
                    attributes: ['name']
                },
                {
                    model: Employee,
                    as: 'assignedTo',
                    attributes: ['name']
                }
            ],
            order: [
                ['createdAt', 'DESC'],
                [{ model: LeadStatusHistory, as: 'statusHistory' }, 'createdAt', 'DESC']
            ],
            limit: limit,
            offset: offset,
            distinct: true // Important for correct count with includes
        });

        res.json({
            leads: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLead = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const employeeId = decodedToken.id;

    console.log(req.body);
    console.log("Convrting Lead to Client");
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    const transaction = await sequelize.transaction();
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Lead not found' });
        }

        const oldStatus = lead.status;
        const newStatus = req.body.status;

        await lead.update(req.body, { transaction });
        if ((newStatus && newStatus !== oldStatus) || req.body.remarks) {
            await LeadStatusHistory.create({
                leadId: lead.id,
                fromStatus: oldStatus,
                toStatus: newStatus || oldStatus,
                remarks: req.body.remarks,
                addedBy: employeeId
            }, { transaction });

            if (newStatus === 'Converted') {
                const clientData = {
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone,
                    company: lead.company,
                    address: lead.address,
                    leadId: lead.id,
                    branchId: lead.branchId,
                    addedByEmployeeId: employeeId,
                    assignedToEmployeeId: lead.assignedToEmployeeId,
                    totalArea: lead.totalArea,
                    whatsapp: lead.whatsapp,
                };

                const existingClient = await Client.findOne({
                    where: { leadId: lead.id },
                    paranoid: false,
                    transaction
                });

                if (existingClient) {
                    if (existingClient.deletedAt) {
                        await existingClient.restore({ transaction });
                    }
                    await existingClient.update(clientData, { transaction });
                } else {
                    await Client.create(clientData, { transaction });
                }
            }

            await notificationController.createNotification(
                'lead_updated',
                'Lead Status Updated',
                `Lead "${lead.name}" status changed from "${oldStatus}" to "${newStatus}".`,
                lead.id,
                'lead',
                employee.name
            );
        }

        await transaction.commit();

        const updatedLead = await Lead.findByPk(lead.id, {
            include: [
                { model: LeadStatusHistory, as: 'statusHistory' },
                { model: Employee, as: 'addedBy', attributes: ['name'] },
                { model: Employee, as: 'assignedTo', attributes: ['name'] }
            ],
            order: [[{ model: LeadStatusHistory, as: 'statusHistory' }, 'createdAt', 'DESC']]
        });

        res.json(updatedLead);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        await lead.destroy();
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.convertToClient = async (req, res) => {
//     console.log("Convrting Lead to Client");
//     const transaction = await sequelize.transaction();
//     try {
//         const lead = await Lead.findByPk(req.params.id);
//         if (!lead) {
//             await transaction.rollback();
//             return res.status(404).json({ error: 'Lead not found' });
//         }
//         const clientData = {
//             name: lead.name,
//             email: lead.email,
//             phone: lead.phone,
//             company: lead.company,
//             address: lead.address,
//             leadId: lead.id,
//             branchId: lead.branchId,
//             employeeId: lead.assignedToEmployeeId,
//             totalArea: lead.totalArea,
//             whatsapp: lead.whatsapp,
//             status: 'Active'
//         };

//         await Client.upsert(
//             clientData,
//             {
//                 transaction
//             }
//         );

//         await lead.update({ status: 'Converted' }, { transaction });

//         await transaction.commit();
//         res.status(200).json({ message: 'Lead converted to client' });

//     } catch (error) {
//         await transaction.rollback();
//         res.status(500).json({ error: error.message });
//     }
// };

exports.convertToClient = async (req, res) => {
    console.log("Converting Lead to Client");

    const transaction = await sequelize.transaction();

    try {
        // 1️⃣ Fetch lead
        const lead = await Lead.findByPk(req.params.id, { transaction });

        if (!lead) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Lead not found' });
        }

        // 2️⃣ Prepare client data
        const clientData = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            address: lead.address,
            leadId: lead.id,
            branchId: lead.branchId,
            employeeId: lead.assignedToEmployeeId,
            totalArea: lead.totalArea,
            whatsapp: lead.whatsapp,
            status: 'Active'
        };

        // 3️⃣ Find client by leadId (including soft-deleted)
        const client = await Client.findOne({
            where: { leadId: lead.id },
            paranoid: false,
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (client) {
            // 4️⃣ Restore if soft-deleted
            if (client.deletedAt) {
                await client.restore({ transaction });
            }

            // 5️⃣ Update client
            await client.update(clientData, { transaction });
        } else {
            // 6️⃣ Create client
            await Client.create(clientData, { transaction });
        }

        // 7️⃣ Ensure lead is marked converted (idempotent)
        if (lead.status !== 'Converted') {
            await lead.update(
                { status: 'Converted' },
                { transaction }
            );
        }

        // 8️⃣ Commit
        await transaction.commit();

        return res.status(200).json({
            message: 'Client restored or created successfully'
        });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

