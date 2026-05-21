const debug = require("debug")("development:app");
const mongoose = require("mongoose");

const batchModel = require("../../models/batchModel");
const classModel = require("../../models/classModel");
// const { Fees } = require("../../models/studentModel");
// const summarizeUnpaidMonths = require("../../utils/utils");

// Get All Batches
const getAllBatches = async (req, res) => {
  try {
    const batches = await batchModel.find().populate("classRef", "name");
    res.status(200).json({ batches });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

//Create batch
const createBatch = async (req, res) => {
  let { batchName, classId, academicYear } = req.body;
  if (!batchName || !classId) {
    return res
      .status(400)
      .json({ message: "Batch Name & Class Id is required." });
  }
  try {
    // Bug #5 fix: Validate class exists BEFORE creating the batch
    // to avoid orphaned batch documents if classId is invalid.
    const classData = await classModel.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const existing = await batchModel.findOne({
      name: batchName,
      classRef: classId,
    });
    if (existing) {
      return res.status(400).json({ message: "Batch already existed." });
    }

    const newBatch = await batchModel.create({
      name: batchName,
      classRef: classId,
      academicYear,
    });

    classData.batches.push(newBatch._id);
    await classData.save();

    res.status(200).json({ newBatch });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
    debug(err);
  }
};

// Update batch
const updateBatch = async (req, res) => {
  const { id } = req.params;
  let { batchName, classId, academicYear } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid batch ID" });
  }

  try {
    const batch = await batchModel.findById(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // If class is changed, update references in Class model
    if (classId && batch.classRef.toString() !== classId) {
      await classModel.findByIdAndUpdate(batch.classRef, {
        $pull: { batches: id },
      });
      await classModel.findByIdAndUpdate(classId, {
        $addToSet: { batches: id },
      });
    }

    if (batchName) batch.name = batchName;
    if (classId) batch.classRef = classId;
    if (academicYear !== undefined) batch.academicYear = academicYear;
    const updatedBatch = await batch.save();

    res.status(200).json(updatedBatch);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
    debug(err);
  }
};

// Delete batch
const deleteBatch = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBatch = await batchModel.findByIdAndDelete(id);
    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Remove batch reference from Class
    if (deletedBatch.classRef) {
      await classModel.findByIdAndUpdate(deletedBatch.classRef, {
        $pull: { batches: id },
      });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
// const getSummarizeFeeData = async (req, res) => {
//   try {
//     const feeData = await Fees.find({})
//       .select("-_id -__V")
//       .populate({
//         path: "stdId",
//         select: "batchRef classRef -_id",
//         populate: [
//           { path: "batchRef", select: "name -_id" },
//           { path: "classRef", select: "name -_id" },
//         ],
//       });
//     const report = summarizeUnpaidMonths(feeData);
//     res.json({ report });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching fee", error: err.message });
//   }
// };

module.exports = { createBatch, updateBatch, deleteBatch, getAllBatches };
