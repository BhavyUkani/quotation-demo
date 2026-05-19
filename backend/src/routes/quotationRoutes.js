const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// Create quotation
router.post('/', quotationController.createQuotation);

// Get all quotations
router.get('/', quotationController.getAllQuotations);

// Get quotation by ID
router.get('/:id', quotationController.getQuotationById);

// Update quotation
router.put('/:id', quotationController.updateQuotation);

// Update quotation status
router.patch('/:id/status', quotationController.updateQuotationStatus);

// Copy quotation
router.post('/:id/copy', quotationController.copyQuotation);

// Delete quotation
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
