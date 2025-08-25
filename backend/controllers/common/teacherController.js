const teacherModel = require("../../models/teacherModel");

const fetchTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find({});
    res.json({ teachers });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching teachers", error: err.message });
  }
};

module.exports = { fetchTeachers };
