const { LeadHistory, File, ToiawaseHistory, User } = require("../models");
const multer = require("multer");
const path = require("path");

// Lấy danh sách tất cả Lead Histories
exports.getAllToiawaseHistories = async (req, res) => {
  try {
    const { id } = req.params;
    const toiawaseHistories = await ToiawaseHistory.findAll({
      where: { toiawaseId: id },
      include: [{ model: User, as: "sender" }],
    });
    res.json(toiawaseHistories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching toiawase histories" });
  }
};

exports.createtoiawaseHistory = async (req, res) => {
  const { id } = req.params;
  const { hasMeeting, isSendSuccess, sendDate, senderId } = req.body;
  try {
    const newToiawaseHistory = await ToiawaseHistory.create({
      hasMeeting,
      isSendSuccess,
      sendDate,
      senderId,
      toiawaseId: id,
    });

    res.status(201).json(newToiawaseHistory);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: "Error creating toiawase history", details: error });
  }
};

// Cập nhật Lead History
// exports.updateLeadHistory = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const leadHistory = await LeadHistory.findByPk(id);
//     if (!leadHistory) {
//       return res.status(404).json({ error: "Lead history not found" });
//     }
//     await leadHistory.update(req.body);
//     res.json(leadHistory);
//   } catch (error) {
//     res.status(500).json({ error: "Error updating lead history" });
//   }
// };

// Xóa Lead History
// exports.deleteLeadHistory = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const leadHistory = await LeadHistory.findByPk(id);
//     if (!leadHistory) {
//       return res.status(404).json({ error: "Lead history not found" });
//     }
//     await leadHistory.destroy();
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting lead history" });
//   }
// };
