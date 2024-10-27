const express = require("express");
const router = express.Router();
const leadHistoryController = require("../controllers/leadHistoryController");

router.get("/lead/:id", leadHistoryController.getAllLeadHistories);
router.post("/:id", leadHistoryController.createLeadHistory);
router.put("/:id", leadHistoryController.updateLeadHistory);
router.delete("/:id", leadHistoryController.deleteLeadHistory);

module.exports = router;
