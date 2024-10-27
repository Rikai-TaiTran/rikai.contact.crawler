const { File } = require('../models');

// Lấy danh sách tất cả Files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' });
  }
};

// Tạo File mới
exports.createFile = async (req, res) => {
  try {
    const { filename, filePath, toiawase_id } = req.body;
    const newFile = await File.create({ filename, filePath, toiawase_id });
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: 'Error creating file' });
  }
};

// Cập nhật File
exports.updateFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    await file.update(req.body);
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error updating file' });
  }
};

// Xóa File
exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    await file.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting file' });
  }
};
