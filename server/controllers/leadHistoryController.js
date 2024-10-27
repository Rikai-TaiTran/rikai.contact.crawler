const { LeadHistory, File } = require("../models");
const multer = require("multer");
const path = require("path");

// Lấy danh sách tất cả Lead Histories
exports.getAllLeadHistories = async (req, res) => {
  try {
    const { id } = req.params;
    const leadHistories = await LeadHistory.findAll({
      where: { leadId: id },
      include: [{ model: File, as: "file" }],
    });
    res.json(leadHistories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching lead histories" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files are saved
  },
  filename: (req, file, cb) => {
    const fileName = Buffer.from(file.originalname, "latin1").toString("utf8");
    const uniqueSuffix = `${Date.now()}-${fileName}`;
    cb(null, uniqueSuffix); // Save file with a unique name
  },
});

const upload = multer({ storage: storage });

exports.createLeadHistory = async (req, res) => {
  upload.single("attachments")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "File upload failed", details: err });
    }

    const { id } = req.params; // Extract leadId from URL params
    const { date, content } = req.body; // Extract other fields from request body

    try {
      let fileId = null;

      // If a file is uploaded, save its details in the File table
      if (req.file) {
        const fileUrl = `${req.protocol}://${req.get("host")}/files/${
          req.file.filename
        }`;
        const fileData = {
          fileName: Buffer.from(req.file.originalname, "latin1").toString(
            "utf8"
          ),
          fileUrl: fileUrl, // Path where the file is saved
          fileType: req.file.mimetype,
        };

        const savedFile = await File.create(fileData);
        console.log(savedFile);

        fileId = savedFile.id; // Retrieve file ID to associate with LeadHistory
      }

      // Create a new LeadHistory entry, including the file ID
      const newLeadHistory = await LeadHistory.create({
        leadId: id,
        contact_date: date,
        description: content,
        fileId: fileId,
      });

      res.status(201).json(newLeadHistory);
    } catch (error) {
      console.log(error);

      // res
      //   .status(500)
      //   .json({ error: "Error creating lead history", details: error });
    }
  });
};

// Cập nhật Lead History
exports.updateLeadHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const leadHistory = await LeadHistory.findByPk(id);
    if (!leadHistory) {
      return res.status(404).json({ error: "Lead history not found" });
    }
    await leadHistory.update(req.body);
    res.json(leadHistory);
  } catch (error) {
    res.status(500).json({ error: "Error updating lead history" });
  }
};

// Xóa Lead History
exports.deleteLeadHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const leadHistory = await LeadHistory.findByPk(id);
    if (!leadHistory) {
      return res.status(404).json({ error: "Lead history not found" });
    }
    await leadHistory.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting lead history" });
  }
};
