const debug = require("debug")("development:app");

const batchModel = require("../../models/batchModel");
const classModel = require("../../models/classModel");
// const { Fees } = require("../../models/studentModel");
// const summarizeUnpaidMonths = require("../../utils/utils");

//Create batch
const createBatch = async (req, res) => {
  let { batchName, classId } = req.body;
  if (!batchName || !classId) {
    return res
      .status(400)
      .json({ message: "Batch Name & Class Id is require." });
  }
  try {
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
    });

    const classData = await classModel.findOne({ _id: classId });
    classData.batches.push(newBatch._id);
    await classData.save();

    res.status(200).json({ newBatch });
  } catch (err) {
    res.status(200).json({ message: "Internal Server Error" });
    debug(err);
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

module.exports = { createBatch };
