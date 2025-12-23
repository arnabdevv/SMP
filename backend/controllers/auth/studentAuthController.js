const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("development:app");

const batchModel = require("../../models/batchModel");
const generateToken = require("../../utils/generateToken");

//Register Student
const { Student, Fees } = require("../../models/studentModel"); // updated export

const registerStudent = async (req, res) => {
  let {
    fullName,
    email,
    phoneNumber,
    parentPhoneNumber,
    password,
    classId,
    batchId,
  } = req.body;

  try {
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !parentPhoneNumber ||
      !password ||
      !classId ||
      !batchId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedStd = await Student.findOne({ email });
    if (existedStd) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStd = await Student.create({
      fullName,
      email,
      phoneNumber,
      parentPhoneNumber,
      password: hashedPassword,
      classRef: classId,
      batchRef: batchId,
    });

    // Now create Fees for this student
    const feesRecord = await Fees.create({
      stdId: newStd._id,
      fees: {},
    });

    // Link fees record to student
    newStd.fees = feesRecord._id;
    await newStd.save();

    const token = generateToken(newStd);
    // res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    const batch = await batchModel.findById(batchId);
    batch.students.push(newStd._id);
    await batch.save();

    // Return sanitized response
    res.status(200).json({
      message: "Student registered successfully",
      user: {
        fullName: newStd.fullName,
        email: newStd.email,
        role: newStd.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Login Student
const loginStudent = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are require" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Email or Password Incorrect" });
    }

    const result = await bcrypt.compare(password, student.password);
    if (result) {
      const token = generateToken(student);
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
      res.status(200).json({
        message: "Login Successful",
        user: {
          fullName: student.fullName,
          email: student.email,
          role: student.role,
        },
      });
    } else {
      res.status(400).json({ message: "Email or Password Incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Problem" });
    debug(err);
  }
};

//Bulk Student Registration
const registerStudentInBulk = async (req, res) => {
  const { students, batchId, classId } = req.body;

  try {
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students found" });
    }

    const batch = await batchModel.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Validate all student entries
    const invalid = students.filter(
      (s) =>
        !String(s.fullName || "").trim() ||
        !String(s.email || "").trim() ||
        !String(s.phoneNumber || "").trim() ||
        !String(s.parentPhoneNumber || "").trim() ||
        !String(s.password || "").trim()
    );

    if (invalid.length > 0) {
      return res
        .status(400)
        .json({ message: "Some entries are invalid", invalid });
    }

    const studentsData = await Promise.all(
      students.map(async (s) => {
        const hashedPassword = await bcrypt.hash(s.password, 10);

        return {
          fullName: s.fullName.trim(),
          email: s.email.trim(),
          phoneNumber: s.phoneNumber.trim(),
          parentPhoneNumber: s.parentPhoneNumber.trim(),
          password: hashedPassword,
          classRef: classId,
          batchRef: batchId,
        };
      })
    );

    // Insert students
    const bulkRegistration = await Student.insertMany(studentsData);

    // Create fees records for each student
    const feesPromises = bulkRegistration.map((student) =>
      Fees.create({
        stdId: student._id,
        fees: {},
      })
    );

    const feesRecords = await Promise.all(feesPromises);

    // Link fees to students
    const updateStudents = bulkRegistration.map((student, index) => {
      student.fees = feesRecords[index]._id;
      return student.save();
    });

    await Promise.all(updateStudents);

    // Update batch with new students
    const studentIds = bulkRegistration.map((student) => student._id);
    batch.students.push(...studentIds);
    await batch.save();

    res.status(200).json({
      message: "Bulk registration successful",
      students: bulkRegistration.map((student) => ({
        fullName: student.fullName,
        email: student.email,
        role: student.role,
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

//logout Student
const logoutStudent = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logout Successfully" });
};

// Delete Student
const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove student from batch
    if (student.batchRef) {
      const batch = await batchModel.findById(student.batchRef);
      if (batch) {
        batch.students = batch.students.filter(
          (id) => id.toString() !== studentId
        );
        await batch.save();
      }
    }

    // Remove fees record and delete student
    if (student.fees) await Fees.findByIdAndDelete(student.fees);
    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  registerStudentInBulk,
  logoutStudent,
  deleteStudent,
};
