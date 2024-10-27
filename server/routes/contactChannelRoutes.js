const express = require('express');
const router = express.Router();
const contactChannelController = require('../controllers/contactChannelController');

router.get('/', contactChannelController.getAllContactChannels);
router.post('/', contactChannelController.createContactChannel);
router.put('/:id', contactChannelController.updateContactChannel);
router.delete('/:id', contactChannelController.deleteContactChannel);

module.exports = router;
