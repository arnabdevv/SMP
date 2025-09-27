const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("development:app");

const studentModel = require("../../models/studentModel");
const batchModel = require("../../models/batchModel");
const generateToken = require("../../utils/generateToken");

//Register Student
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
      return res.status(400).json({ message: "All fields are require" });
    }

    const existedStd = await studentModel.findOne({ email, fullName });
    if (existedStd) {
      return res.status(400).json({ message: "Student already existed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStd = await studentModel.create({
      fullName,
      email,
      phoneNumber,
      parentPhoneNumber,
      password: hashedPassword,
      classRef: classId,
      batchRef: batchId,
    });

    const token = generateToken(newStd);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    const batch = await batchModel.findOne({ _id: batchId });
    batch.students.push(newStd._id);
    await batch.save();

    res.status(200).json({ newStd });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Problem" });
    debug(err);
  }
};

//Login Student
const loginStudent = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are require" });
    }

    const student = await studentModel.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Email or Password Incorrect" });
    }

    const result = await bcrypt.compare(password, student.password);
    if (result) {
      const token = generateToken(student);
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
      res
        .status(200)
        .json({
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

    const bulkRegistration = await studentModel.insertMany(studentsData);

    const studentIds = bulkRegistration.map((student) => student._id);

    batch.students.push(...studentIds);
    await batch.save();

    res.status(200).json({ bulkRegistration });
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

module.exports = {
  registerStudent,
  loginStudent,
  registerStudentInBulk,
  logoutStudent,
};
