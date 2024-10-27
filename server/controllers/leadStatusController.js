const { LeadStatus } = require('../models');

// Lấy danh sách tất cả Lead Statuses
exports.getAllLeadStatuses = async (req, res) => {
  try {
    const leadStatuses = await LeadStatus.findAll();
    res.json(leadStatuses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lead statuses' });
  }
};

// Tạo Lead Status mới
exports.createLeadStatus = async (req, res) => {
  try {
    const { name } = req.body;
    const newLeadStatus = await LeadStatus.create({ name });
    res.status(201).json(newLeadStatus);
  } catch (error) {
    res.status(500).json({ error: 'Error creating lead status' });
  }
};

// Cập nhật Lead Status
exports.updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const leadStatus = await LeadStatus.findByPk(id);
    if (!leadStatus) {
      return res.status(404).json({ error: 'Lead status not found' });
    }
    await leadStatus.update(req.body);
    res.json(leadStatus);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lead status' });
  }
};

// Xóa Lead Status
exports.deleteLeadStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const leadStatus = await LeadStatus.findByPk(id);
    if (!leadStatus) {
      return res.status(404).json({ error: 'Lead status not found' });
    }
    await leadStatus.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lead status' });
  }
};
