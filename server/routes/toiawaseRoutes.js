const express = require("express");
const router = express.Router();
const toiawaseController = require("../controllers/toiawaseController");

router.get("/", toiawaseController.getAllToiawase);
router.get("/:id", toiawaseController.detailToiawase);
router.post("/", toiawaseController.createToiawase);
router.put("/:id", toiawaseController.updateToiawase);
router.delete("/:id", toiawaseController.deleteToiawase);

module.exports = router;
