const batchModel = require("../../models/batchModel");
const { Student, Fees } = require("../../models/studentModel"); // updated export

// Get students by class and/or batch, with population
const getStudentsByClassAndBatch = async (req, res) => {
  try {
    const { classId, batchId } = req.query;
    let filter = {};
    if (classId) filter.classRef = classId;
    if (batchId) filter.batchRef = batchId;

    // Populate classRef and batchRef for display
    const students = await Student.find(filter)
      .select("_id fullName email phoneNumber parentPhoneNumber")
      .populate("classRef", "name")
      .populate("batchRef", "name");
    res.status(200).json({ students });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: err.message });
  }
};

// Diagnostic endpoint to check batch consistency
const getBatchDiagnostics = async (req, res) => {
  try {
    const { batchId } = req.query;

    if (!batchId) {
      return res.status(400).json({ message: "batchId is required" });
    }

    const batch = await batchModel.findById(batchId).populate([
      { path: "classRef", select: "name" },
      { path: "students", select: "_id fullName email classRef batchRef" },
    ]);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Count students in batch.students array
    const batchStudentsCount = batch.students.length;

    // Count students in database by classRef and batchRef
    const dbStudentsCount = await Student.countDocuments({
      classRef: batch.classRef,
      batchRef: batchId,
    });

    // Find students in batch array that don't match batchRef or classRef
    const mismatches = batch.students.filter((student) => {
      return (
        student.batchRef.toString() !== batchId ||
        student.classRef.toString() !== batch.classRef.toString()
      );
    });

    res.status(200).json({
      batchName: batch.name,
      studentsInBatchArray: batchStudentsCount,
      studentsInDatabase: dbStudentsCount,
      mismatches: mismatches.length,
      mismatchedStudents: mismatches.map((s) => ({
        id: s._id,
        name: s.fullName,
        email: s.email,
        expectedBatchRef: batchId,
        actualBatchRef: s.batchRef,
        expectedClassRef: batch.classRef,
        actualClassRef: s.classRef,
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching diagnostics", error: err.message });
  }
};

const updateStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      fullName,
      email,
      phoneNumber,
      parentPhoneNumber,
      newClassId,
      newBatchId,
    } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email !== student.email) {
      const existing = await Student.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Email already in use by another student" });
      }
      student.email = email;
    }

    if (fullName) student.fullName = fullName;
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (parentPhoneNumber) student.parentPhoneNumber = parentPhoneNumber;

    const oldBatchId = String(student.batchRef);
    const oldClassId = String(student.classRef);

    if (newClassId && newClassId !== oldClassId) {
      student.classRef = newClassId;
    }

    if (newBatchId && newBatchId !== oldBatchId) {
      await batchModel.findByIdAndUpdate(oldBatchId, {
        $pull: { students: student._id },
      });

      await batchModel.findByIdAndUpdate(newBatchId, {
        $addToSet: { students: student._id },
      });

      student.batchRef = newBatchId;
    }

    await student.save();

    res.status(200).json({
      message: "Student details updated successfully",
      student: {
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        parentPhoneNumber: student.parentPhoneNumber,
        classRef: student.classRef,
        batchRef: student.batchRef,
      },
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getStudentsByClassAndBatch,
  updateStudentDetails,
  getBatchDiagnostics,
};
