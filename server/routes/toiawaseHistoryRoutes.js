const express = require("express");
const router = express.Router();
const toiawaseHistoryController = require("../controllers/toiawaseHistoryController");

router.get("/toiawase/:id", toiawaseHistoryController.getAllToiawaseHistories);
router.post("/toiawase/:id", toiawaseHistoryController.createtoiawaseHistory);

module.exports = router;
