const express = require('express');
const router = express.Router();
const { generatePdf } = require('../controllers/pdfGenerationController');

// /:id → download/view pdf for specific quotation
router.get('/:id', generatePdf);

module.exports = router;