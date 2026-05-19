const {
    Quotation,
    Client,
    Lead,
    Site,
    SiteMaterial,
    QuotationStatusHistory,
    sequelize
} = require('../models');
const { Op } = require('sequelize');
const { getBranchIdFromToken } = require('../utils/branch.helper');

exports.getDashboardStats = async (req, res) => {
    const branchId = await getBranchIdFromToken(req.headers.authorization.split(' ')[1]);
    const whereClause = { branchId };
    try {

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const now = new Date();

        // 1. Quotation Counts
        const totalQuotations = await Quotation.count({ where: whereClause });
        const approvedQuotations = await Quotation.count({ where: { status: 'Accepted', ...whereClause } });
        const draftQuotations = await Quotation.count({ where: { status: 'Draft', ...whereClause } });
        const sentQuotations = await Quotation.count({ where: { status: 'Sent', ...whereClause } });
        const pendingQuotations = draftQuotations + sentQuotations;

        const rejectedQuotations = await Quotation.count({ where: { status: 'Rejected', ...whereClause } });

        // New Overview Stats
        const totalLeads = await Lead.count({ where: whereClause });
        const totalSites = await Site.count({ where: whereClause });
        const runningSitesCount = await Site.count({ where: { status: 'Active', ...whereClause } });

        const runningSitesExpense = await SiteMaterial.sum('cost', {
            include: [{
                model: Site,
                as: 'site',
                where: { status: 'Active', ...whereClause },
                required: true
            }]
        }) || 0;

        let leadConversionRatio = 0;
        if (totalLeads > 0) {
            const convertedLeads = await Lead.count({ where: { status: 'Converted', ...whereClause } });
            leadConversionRatio = ((convertedLeads / totalLeads) * 100).toFixed(1);
        }

        const totalQuotationValue = await Quotation.sum('totalCost', { where: whereClause }) || 0;

        // This Month's Revenue (Accepted quotations updated this month)
        const thisMonthsRevenue = await Quotation.sum('totalCost', {
            where: {
                status: 'Accepted',
                updatedAt: { [Op.gte]: startOfMonth },
                ...whereClause
            }
        }) || 0;

        // Total Estimated Cost & Quoted Amount
        const totalEstimatedCost = 0; // ProjectCost column was removed, temporarily setting to 0
        const totalQuotedAmount = await Quotation.sum('totalCost', { where: whereClause }) || 0;    // "Final Cost" after discount

        // Expected Profit (Placeholder logic: 20% of Total Quoted Amount)
        const expectedProfit = totalQuotedAmount * 0.20;

        // 3. Monthly Trend (Last 12 months)
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);
        oneYearAgo.setDate(1); // Set to beginning of that month
        oneYearAgo.setHours(0, 0, 0, 0);

        const monthlyTrend = await Quotation.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: oneYearAgo },
                ...whereClause
            },
            group: ['month'],
            order: [['month', 'ASC']]
        });

        // 4. Client Insights
        const totalClients = await Client.count({ where: whereClause });
        const newClients = await Client.count({
            where: { createdAt: { [Op.gte]: startOfMonth }, ...whereClause }
        });

        // Repeat Clients (Clients with > 1 quotation)
        // This query might be expensive on large datasets, optimize if needed
        const repeatClientsCount = await Quotation.findAll({
            attributes: ['clientId'],
            group: ['clientId'],
            having: sequelize.literal('COUNT(id) > 1'),
            where: whereClause
        });
        const repeatClients = repeatClientsCount.length;

        // Top 5 Clients by Value
        const topClients = await Quotation.findAll({
            attributes: [
                'clientId',
                [sequelize.fn('SUM', sequelize.col('totalCost')), 'totalValue']
            ],
            include: [{
                model: Client,
                as: 'client',
                attributes: ['name']
            }],
            group: ['clientId', 'client.id', 'client.name'], // Group by client details too
            order: [[sequelize.literal('totalValue'), 'DESC']],
            where: whereClause,
            limit: 5
        });

        // 5. Recent Activity Feed
        // Fetch recent Quotation creations
        const recentQuotations = await Quotation.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Client,
                as: 'client',
                attributes: ['name']
            }],
            where: whereClause
        });

        const recentHistory = await QuotationStatusHistory.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Quotation,
                as: 'quotation',
                attributes: ['quotationNumber']
            }],
        });

        // Combine and sort
        const activityFeed = [
            ...recentQuotations.map(q => ({
                type: 'created',
                date: q.createdAt,
                message: `Quotation ${q.quotationNumber} created for ${q.client?.name || 'Unknown Client'}`
            })),
            ...recentHistory.map(h => ({
                type: 'status_change',
                date: h.createdAt,
                message: `Quotation ${h.quotation?.quotationNumber || 'Unknown'} status changed to ${h.newStatus}`
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        // 6. Action Center Items
        // Expiring quotations (validTo < today + 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const expiringQuotations = await Quotation.count({
            where: {
                status: 'Sent',
                validTo: {
                    [Op.between]: [now, nextWeek]
                },
                ...whereClause
            }
        });

        // High Value Pending Deals (Pending > 100,000 example threshold)
        const highValuePending = await Quotation.count({
            where: {
                status: 'Sent',
                totalCost: { [Op.gt]: 100000 },
                ...whereClause
            }
        });

        // 7. Cloud Storage Usage
        const getDirectorySize = (dirPath) => {
            let size = 0;
            try {
                const files = require('fs').readdirSync(dirPath);
                for (const file of files) {
                    if (file === '.git') continue;
                    const filePath = require('path').join(dirPath, file);
                    const stats = require('fs').statSync(filePath);
                    if (stats.isDirectory()) {
                        size += getDirectorySize(filePath);
                    } else {
                        size += stats.size;
                    }
                }
            } catch (err) { }
            return size;
        };

        let usedStorageBytes = getDirectorySize(process.cwd());

        const quotationSize = await Quotation.count();
        const quotationSizeInBytes = quotationSize * 10 * 1024 * 1024;
        usedStorageBytes += quotationSizeInBytes;

        const totalStorageBytes = 50 * 1024 * 1024 * 1024; // 50 GB

        res.json({
            overview: {
                totalQuotations,
                totalLeads,
                totalClients: totalClients,
                totalSites,
                runningSitesCount,
                runningSitesExpense,
                leadConversionRatio
            },
            quotations: {
                total: totalQuotations,
                approved: approvedQuotations,
                pending: pendingQuotations,
                rejected: rejectedQuotations,
                draft: draftQuotations,
                sent: sentQuotations
            },
            financials: {
                totalValue: totalQuotationValue,
                thisMonthRevenue: thisMonthsRevenue,
                totalEstimatedCost: totalEstimatedCost,
                totalQuotedAmount: totalQuotedAmount,
                expectedProfit: expectedProfit
            },
            charts: {
                monthlyTrend,
                approvalRatio: {
                    approved: approvedQuotations,
                    rejected: rejectedQuotations
                }
            },
            clients: {
                total: totalClients,
                newThisMonth: newClients,
                repeat: repeatClients,
                top5: topClients
            },
            activity: activityFeed,
            actionCenter: {
                pendingApprovals: pendingQuotations, // Reusing pending count
                expiring: expiringQuotations,
                highValueDetails: highValuePending,
                followUpsToday: 0 // Placeholder as follow-ups logic isn't defined yet
            },
            storage: {
                used: usedStorageBytes,
                total: totalStorageBytes
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: error.message });
    }
};
