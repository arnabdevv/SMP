const bcrypt = require("bcrypt");
const debug = require("debug")("development:app");

const studentModel = require("../../models/studentModel");
const batchModel = require("../../models/batchModel");

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

    const batch = await batchModel.findOne({ _id: batchId });
    batch.students.push(newStd._id);
    await batch.save();

    res.status(200).json({ newStd });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Problem" });
    debug(err);
  }
};

//Bulk Student Registration
const registerStudentInBulk = async (req, res) => {
  const { students } = req.body;

  try {
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students found" });
    }

    const invalid = students.filter(
      (s) =>
        !s.fullName?.trim() ||
        !s.email?.trim() ||
        !s.phoneNumber?.trim() ||
        !s.parentPhoneNumber?.trim() ||
        !s.password?.trim() ||
        !s.classId ||
        !s.batchId
    );

    if (invalid.length > 0) {
      return res
        .status(400)
        .json({ message: "Some entries are invalid", invalid });
    }

    const studentsData = students.map((s) => ({
      fullName: s.fullName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      parentPhoneNumber: s.parentPhoneNumber,
      password: s.password,
      classRef: s.classId,
      batchRef: s.batchId,
    }));

    const bulkRegistration = await studentModel.insertMany(studentsData);

    const studentIds = bulkRegistration.map((student) => student._id);
    // console.log(studentIds);
    const batchId = bulkRegistration[0].batchRef;

    const batch = await batchModel.findOne({ _id: batchId });
    batch.students.push(...studentIds);
    await batch.save();

    res.status(200).json({ bulkRegistration });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Problem" });
    debug(err);
  }
};

module.exports = { registerStudent, registerStudentInBulk };
