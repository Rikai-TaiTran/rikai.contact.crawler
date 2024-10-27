const express = require("express");
const router = express.Router();
const leadTypeController = require("../controllers/leadTypeController");

router.get("/", leadTypeController.getAllLeadType);
router.post("/", leadTypeController.createLeadType);
router.put("/:id", leadTypeController.updateLeadType);
router.delete("/:id", leadTypeController.deleteLeadType);

module.exports = router;
