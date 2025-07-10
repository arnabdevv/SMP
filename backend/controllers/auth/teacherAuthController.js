const bcrypt = require("bcrypt");
const teacherModel = require("../../models/teacherModel");
const generateToken = require("../../utils/generateToken");

const registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacher = await teacherModel.findOne({ email });
    if (teacher) {
      return res
        .status(400)
        .json({ message: "Teacher already exists, please login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTeacher = await teacherModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newTeacher);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    return res.status(200).json({ message: "Teacher Register Successful" });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await teacherModel.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Email or Password Incorrect" });
    }
    const result = await bcrypt.compare(password, teacher.password);
    if (result) {
      const token = generateToken(teacher);
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
      return res.status(200).json({ message: "Login Successful" });
    } else {
      return res.status(400).json({ message: "Email or Password Incorrect" });
    }
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

const logoutTeacher = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logout Successfully" });
};

module.exports = { registerTeacher, loginTeacher, logoutTeacher };
