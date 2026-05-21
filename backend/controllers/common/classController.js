const debug = require("debug")("development:app");

const classModel = require("../../models/classModel");
const batchModel = require("../../models/batchModel");

//Create class
const createClass = async (req, res) => {
  let { className, teacherId, description } = req.body;
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
      teacher: teacherId || undefined,
      description,
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
    const classes = await classModel
      .find({})
      .populate("batches", "_id name")
      .populate({
        path: "teacher",
        select: "user subject",
        populate: { path: "user", select: "name" },
      });
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

// Update class
const updateClass = async (req, res) => {
  const { id } = req.params;
  const { className, teacherId, description } = req.body;

  try {
    // Bug #8 fix: Only include fields that were actually provided.
    // Passing undefined values to findByIdAndUpdate would unset existing fields.
    const updateData = {};
    if (className !== undefined) updateData.name = className;
    if (teacherId !== undefined) updateData.teacher = teacherId || null;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedClass = await classModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class updated successfully", class: updatedClass });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating class", error: err.message });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClass = await classModel.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting class", error: err.message });
  }
};

module.exports = { createClass, fetchClasses, updateClass, deleteClass };
