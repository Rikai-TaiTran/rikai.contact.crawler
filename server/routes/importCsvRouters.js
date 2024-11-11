const express = require("express");
const multer = require("multer");
const { importCSV } = require("../controllers/importCsvController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route for CSV import
router.post("/", upload.single("file"), importCSV);

module.exports = router;
