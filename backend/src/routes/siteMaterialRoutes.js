const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable access to parent route params if nested, but here we might structure differently.
// Actually, let's keep it simple. I'll define routes like /sites/:id/materials

const siteMaterialController = require('../controllers/siteMaterialController');

// Routes for /api/sites/:id/materials
router.get('/:id/materials', siteMaterialController.getMaterials);
router.post('/:id/materials', siteMaterialController.addMaterial);
router.delete('/materials/:materialId', siteMaterialController.deleteMaterial);

module.exports = router;
