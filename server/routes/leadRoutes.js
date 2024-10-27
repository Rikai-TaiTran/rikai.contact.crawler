const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.get("/statistics_status", leadController.getLeadStatisticsByStatus);
router.get("/statistics_type", leadController.getLeadStatisticsByType);
router.get("/statistics_owner", leadController.getLeadStatisticsByOwner);
router.get("/", leadController.getAllLeads);
router.post("/", leadController.createLead);
router.get("/:id", leadController.detailLead);
router.put("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

module.exports = router;
