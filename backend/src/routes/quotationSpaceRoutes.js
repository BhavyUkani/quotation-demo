const express = require('express');
const router = express.Router();
const quotationSpaceController = require('../controllers/quotationSpaceController');

// Quotation Space routes
router.get('/quotations/:quotationId/spaces', quotationSpaceController.getQuotationSpaces);
router.post('/quotations/:quotationId/spaces', quotationSpaceController.createQuotationSpace);
router.put('/quotation-spaces/:spaceId', quotationSpaceController.updateQuotationSpace);
router.delete('/quotation-spaces/:spaceId', quotationSpaceController.deleteQuotationSpace);

// Work Item routes
router.post('/quotation-spaces/:spaceId/workitems', quotationSpaceController.addWorkItem);
router.put('/quotation-workitems/:workItemId', quotationSpaceController.updateWorkItem);
router.delete('/quotation-workitems/:workItemId', quotationSpaceController.deleteWorkItem);
router.put('/quotation-workitems/bulk', quotationSpaceController.bulkUpdateWorkItems);

module.exports = router;
