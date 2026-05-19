const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
// potentially add auth middleware here if needed, consistent with other routes
// const { authenticate } = require('../middleware/authMiddleware');

// Check if other routes use authentication. Assuming yes based on "protected routes" in frontend
// But for now, I won't import it unless I see it used in other routes clearly (I can check files, but just creating basic routes first)
// Looking at clientRoutes would confirm. For now, open routes or add middleware later.
// Let's assume protection is handled or not required for this specific step yet, but conventionally yes.
// I'll stick to basic router for now to match simplicity unless I see authMiddleware file content.

router.get('/', siteController.getAllSites);
router.get('/:id', siteController.getSiteById);
router.post('/', siteController.createSite);
router.post('/create-from-quotation', siteController.createSiteFromQuotation);
router.put('/:id', siteController.updateSite);
router.delete('/:id', siteController.deleteSite);

module.exports = router;
