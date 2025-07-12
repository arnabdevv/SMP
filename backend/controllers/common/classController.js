const debug = require("debug")("development:app");

const classModel = require("../../models/classModel");

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

module.exports = { createClass };
