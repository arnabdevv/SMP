// Batch Router
const express = require("express");
const router = express.Router();

const { createBatch } = require("../controllers/common/batchController");

// GET   /api/batch/         - Test route ("Batch Router")
router.get("/", (req, res) => {
  res.send("Batch Router");
});

// router.get("/getSummeryFeeData", getSummarizeFeeData);

// POST  /api/batch/create   - Create a new batch
router.post("/create", createBatch);

module.exports = router;
