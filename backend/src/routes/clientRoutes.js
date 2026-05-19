const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

// Note Routes
router.post('/:id/notes', clientController.addNote);

router.delete('/notes/:noteId', clientController.deleteNote);

module.exports = router;
