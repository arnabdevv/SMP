const batchModel = require("../../models/batchModel");
const classModel = require("../../models/classModel");

//Create batch
const createBatch = async (req, res) => {
  let { batchName, classId } = req.body;
  if (!batchName || !classId) {
    return res
      .status(400)
      .json({ message: "Batch Name & Class Id is require." });
  }
  try {
    const existing = await batchModel.findOne({ name: batchName });
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

    res.send(newBatch);
  } catch (err) {
    res.send(err);
  }
};

module.exports = { createBatch };
