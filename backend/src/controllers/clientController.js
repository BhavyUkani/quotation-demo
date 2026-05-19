const { Client, ClientNote, Employee, Lead } = require('../models');
const notificationController = require('./notificationController');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = "your-secret-key-change-this-in-production";

exports.createClient = async (req, res) => {
    try {
        console.log(req.body);

        const clientData = { ...req.body };

        // Auto-assign creator and branch info if user is authenticated
        if (req.user) {
            clientData.addedByEmployeeId = req.user.id;
            // Default assignment to creator if not specified
            if (!clientData.assignedToEmployeeId) {
                clientData.assignedToEmployeeId = req.user.id;
            }

            // Handle Branch Assignment
            if (req.user.isMaster) {
                if (req.user.lastSelectedBranchId) {
                    clientData.branchId = req.user.lastSelectedBranchId;
                }
            } else {
                clientData.branchId = req.user.branchId;
            }
        }

        const client = await Client.create(clientData);

        // Create notification
        await notificationController.createNotification(
            'client_created',
            'New Client Added',
            `A new client "${client.name}" has been added to the system.`,
            client.id,
            'client',
            req.user?.id
        );

        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        const whereClause = {};
        const employee = req.user;
        // employee is already fetched by authMiddleware

        if (employee) {
            if (employee) {
                if (employee.isMaster) {
                    if (employee.lastSelectedBranchId) {
                        whereClause.branchId = employee.lastSelectedBranchId;
                    }
                } else {
                    whereClause.branchId = employee.branchId;
                    // Show clients added by OR assigned to this employee
                    whereClause[Op.or] = [
                        { addedByEmployeeId: id },
                        { assignedToEmployeeId: id }
                    ];
                }
            }

            const clients = await Client.findAll({
                where: whereClause,
                include: [
                    {
                        model: ClientNote,
                        as: 'notes',
                        include: [
                            { model: Employee, as: 'creator', attributes: ['name', 'id'] }
                        ]
                    },
                    { model: Employee, as: 'addedBy', attributes: ['name'] },
                    { model: Employee, as: 'assignedTo', attributes: ['name'] }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(clients);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ error: 'Client not found' });

        await client.update(req.body);

        // Create notification
        await notificationController.createNotification(
            'client_updated',
            'Client Updated',
            `Client "${client.name}" information has been updated.`,
            client.id,
            'client',
            req.user?.id
        );

        res.json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);

        if (!client) return res.status(404).json({ error: 'Client not found' });
        const lead = await Lead.findOne({ where: { id: client.leadId } });
        if (lead) {
            await lead.update({ status: 'Closed' });
        }
        await client.destroy();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Note Management
exports.addNote = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const note = await ClientNote.create({
            clientId: req.params.id,
            note: req.body.note,
            addedBy: employeeId
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await ClientNote.findByPk(req.params.noteId);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        await note.destroy();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
