const express = require('express');
const router = express.Router();
const leadSourceController = require('../controllers/leadSourceController');

router.get('/', leadSourceController.getAllLeadSources);
router.post('/', leadSourceController.createLeadSource);
router.put('/:id', leadSourceController.updateLeadSource);
router.delete('/:id', leadSourceController.deleteLeadSource);

module.exports = router;
