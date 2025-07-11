const express = require("express");
const router = express.Router();

const { createBatch } = require("../controllers/common/batchController");

router.get("/", (req, res) => {
  res.send("Batch Router");
});

router.post("/create", createBatch);

module.exports = router;
