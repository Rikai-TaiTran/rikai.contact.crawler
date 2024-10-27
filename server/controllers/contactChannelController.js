const { ContactChannel } = require('../models');

// Lấy danh sách tất cả Contact Channels
exports.getAllContactChannels = async (req, res) => {
  try {
    const contactChannels = await ContactChannel.findAll();
    res.json(contactChannels);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contact channels' });
  }
};

// Tạo Contact Channel mới
exports.createContactChannel = async (req, res) => {
  try {
    const { name } = req.body;
    const newContactChannel = await ContactChannel.create({ name });
    res.status(201).json(newContactChannel);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact channel' });
  }
};

// Cập nhật Contact Channel
exports.updateContactChannel = async (req, res) => {
  const { id } = req.params;
  try {
    const contactChannel = await ContactChannel.findByPk(id);
    if (!contactChannel) {
      return res.status(404).json({ error: 'Contact channel not found' });
    }
    await contactChannel.update(req.body);
    res.json(contactChannel);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact channel' });
  }
};

// Xóa Contact Channel
exports.deleteContactChannel = async (req, res) => {
  const { id } = req.params;
  try {
    const contactChannel = await ContactChannel.findByPk(id);
    if (!contactChannel) {
      return res.status(404).json({ error: 'Contact channel not found' });
    }
    await contactChannel.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact channel' });
  }
};
