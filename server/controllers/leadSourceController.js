const { LeadSource } = require('../models');

// Lấy danh sách tất cả Lead Sources
exports.getAllLeadSources = async (req, res) => {
  try {
    const leadSources = await LeadSource.findAll();
    res.json(leadSources);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lead sources' });
  }
};

// Tạo Lead Source mới
exports.createLeadSource = async (req, res) => {
  try {
    const { name } = req.body;
    const newLeadSource = await LeadSource.create({ name });
    res.status(201).json(newLeadSource);
  } catch (error) {
    res.status(500).json({ error: 'Error creating lead source' });
  }
};

// Cập nhật Lead Source
exports.updateLeadSource = async (req, res) => {
  const { id } = req.params;
  try {
    const leadSource = await LeadSource.findByPk(id);
    if (!leadSource) {
      return res.status(404).json({ error: 'Lead source not found' });
    }
    await leadSource.update(req.body);
    res.json(leadSource);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lead source' });
  }
};

// Xóa Lead Source
exports.deleteLeadSource = async (req, res) => {
  const { id } = req.params;
  try {
    const leadSource = await LeadSource.findByPk(id);
    if (!leadSource) {
      return res.status(404).json({ error: 'Lead source not found' });
    }
    await leadSource.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lead source' });
  }
};
