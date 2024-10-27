const { LeadType } = require("../models");

// Lấy danh sách tất cả Lead Statuses
exports.getAllLeadType = async (req, res) => {
  try {
    const leadTypes = await LeadType.findAll();
    res.json(leadTypes);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Error fetching lead types" });
  }
};

// Tạo Lead Status mới
exports.createLeadType = async (req, res) => {
  try {
    const { name } = req.body;
    const newLeadType = await LeadType.create({ name });
    res.status(201).json(newLeadType);
  } catch (error) {
    res.status(500).json({ error: "Error creating lead type" });
  }
};

// Cập nhật Lead Status
exports.updateLeadType = async (req, res) => {
  const { id } = req.params;
  try {
    const leadType = await LeadType.findByPk(id);
    if (!leadType) {
      return res.status(404).json({ error: "Lead type not found" });
    }
    await leadType.update(req.body);
    res.json(leadType);
  } catch (error) {
    res.status(500).json({ error: "Error updating lead type" });
  }
};

// Xóa Lead Status
exports.deleteLeadType = async (req, res) => {
  const { id } = req.params;
  try {
    const leadType = await LeadType.findByPk(id);
    if (!leadType) {
      return res.status(404).json({ error: "Lead type not found" });
    }
    await leadType.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting lead type" });
  }
};
