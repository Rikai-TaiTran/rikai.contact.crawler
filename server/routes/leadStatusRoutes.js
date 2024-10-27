const express = require('express');
const router = express.Router();
const leadStatusController = require('../controllers/leadStatusController');

router.get('/', leadStatusController.getAllLeadStatuses);
router.post('/', leadStatusController.createLeadStatus);
router.put('/:id', leadStatusController.updateLeadStatus);
router.delete('/:id', leadStatusController.deleteLeadStatus);

module.exports = router;
