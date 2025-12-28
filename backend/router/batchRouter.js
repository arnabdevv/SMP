// Batch Router
const express = require("express");
const router = express.Router();

const {
  createBatch,
  updateBatch,
  deleteBatch,
  getAllBatches,
} = require("../controllers/common/batchController");

// GET   /api/batch/         - Test route ("Batch Router")
router.get("/", (req, res) => {
  res.send("Batch Router");
});

// router.get("/getSummeryFeeData", getSummarizeFeeData);

// GET   /api/batch/all      - Get all batches
router.get("/all", getAllBatches);

// POST  /api/batch/create   - Create a new batch
router.post("/create", createBatch);

// PUT  /api/batch/:id      - Update a batch
router.put("/:id", updateBatch);

// DELETE  /api/batch/:id   - Delete a batch
router.delete("/:id", deleteBatch);
module.exports = router;
