const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', branchController.getAllBranches);
router.post('/', branchController.createBranch);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

// Route for master to select active branch context
router.post('/select', authMiddleware, branchController.updateSelectedBranch);

module.exports = router;
