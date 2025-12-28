const bcrypt = require("bcrypt");
const adminModel = require("../../models/adminModel");
const generateToken = require("../../utils/generateToken");

const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await adminModel.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ message: "Admin already exists, please login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await adminModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newAdmin);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    return res.status(200).json({ message: "Admin Register Successful" });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await adminModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "WARNING: You Don't Have Permission" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = generateToken(user);
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
      return res
        .status(200)
        .json({
          message: "Login Successful",
          role: user.role,
          name: user.fullName,
        });
    } else {
      return res
        .status(400)
        .json({ message: "WARNING: You Don't Have Permission" });
    }
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

const logoutAdmin = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logout Successfully" });
};

module.exports = { registerAdmin, loginAdmin, logoutAdmin };
