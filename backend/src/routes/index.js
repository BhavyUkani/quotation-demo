const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const leadRoutes = require('./leadRoutes');
const clientRoutes = require('./clientRoutes');
const packageRoutes = require('./packages');
const packageSpaceRoutes = require('./packageSpaceRoutes');
const notificationRoutes = require('./notificationRoutes');
const quotationRoutes = require('./quotationRoutes');
const quotationSpaceRoutes = require('./quotationSpaceRoutes');
const siteRoutes = require('./siteRoutes');
const siteMaterialRoutes = require('./siteMaterialRoutes');
const pdfGenerationRoutes = require('./pdfGenerationRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const branchRoutes = require('./branchRoutes');

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/leads', leadRoutes);
router.use('/clients', clientRoutes);
router.use('/packages', packageRoutes);
router.use('/', packageSpaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/quotations', quotationRoutes);
router.use('/', quotationSpaceRoutes);
router.use('/sites', siteRoutes);
router.use('/sites', siteMaterialRoutes);
router.use('/branches', branchRoutes);
router.use('/pdf', pdfGenerationRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
