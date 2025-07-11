const bcrypt = require("bcrypt");
const debug = require("debug")("development:app");

const studentModel = require("../../models/studentModel");
const batchModel = require("../../models/batchModel");

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

    res.send(newStd);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    debug(err);
  }
};

module.exports = { registerStudent };
