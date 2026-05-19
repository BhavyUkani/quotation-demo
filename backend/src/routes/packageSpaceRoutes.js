const express = require('express');
const router = express.Router();
const packageSpaceController = require('../controllers/packageSpaceController');

// Package Space routes
router.get('/packages/:packageId/spaces', packageSpaceController.getPackageSpaces);
router.post('/packages/:packageId/spaces', packageSpaceController.createPackageSpace);
router.put('/spaces/:spaceId', packageSpaceController.updatePackageSpace);
router.delete('/spaces/:spaceId', packageSpaceController.deletePackageSpace);

// Work Item routes
router.post('/spaces/:spaceId/workitems', packageSpaceController.addWorkItem);
router.put('/workitems/:workItemId', packageSpaceController.updateWorkItem);
router.delete('/workitems/:workItemId', packageSpaceController.deleteWorkItem);
router.put('/workitems/bulk', packageSpaceController.bulkUpdateWorkItems);

module.exports = router;
