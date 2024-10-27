const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/files/:filename", async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, (err) => {
    console.log(err);

    if (err) {
      return res.status(404).send("File not found.");
    }
  });
});

module.exports = router;
