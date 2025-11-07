const debug = require("debug")("development:app");

const classModel = require("../../models/classModel");
const batchModel = require("../../models/batchModel");

//Create class
const createClass = async (req, res) => {
  let { className } = req.body;
  if (!className) {
    return res.status(400).json({ message: "Class Name is require." });
  }
  try {
    const existing = await classModel.findOne({ name: className });
    if (existing) {
      return res.status(400).json({ message: "Class already existed." });
    }
    const newClass = await classModel.create({
      name: className,
    });
    res.status(200).json({ newClass });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating class", error: err.message });
  }
};

// Fetch all classes with batch name & id.
const fetchClasses = async (req, res) => {
  try {
    const classes = await classModel.find({}).populate("batches", "_id name");
    // For each batch, get count via aggregation
    const classesWithCounts = await Promise.all(
      classes.map(async (cls) => {
        const batchCounts = await Promise.all(
          cls.batches.map(async (batch) => {
            const result = await batchModel.aggregate([
              { $match: { _id: batch._id } },
              { $project: { count: { $size: "$students" } } },
            ]);
            const studentCount = result.length ? result[0].count : 0;
            return { ...batch.toObject(), studentCount };
          })
        );

        return { ...cls.toObject(), batches: batchCounts };
      })
    );

    res.json({ classes: classesWithCounts });
    // res.json({ classes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching classes", error: err.message });
  }
};

module.exports = { createClass, fetchClasses };
