const studentModel = require("../../models/studentModel");

// Get students by class and/or batch, with population
const getStudentsByClassAndBatch = async (req, res) => {
  try {
    const { classId, batchId } = req.query;
    let filter = {};
    if (classId) filter.classRef = classId;
    if (batchId) filter.batchRef = batchId;

    // Populate classRef and batchRef for display
    const students = await studentModel
      .find(filter)
      .select("fullName email phoneNumber parentPhoneNumber")
      .populate("classRef", "name")
      .populate("batchRef", "name");
    res.status(200).json({ students });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: err.message });
  }
};

module.exports = { getStudentsByClassAndBatch };
