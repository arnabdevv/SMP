const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const teacherModel = require("../models/teacherModel");
const { Student } = require("../models/studentModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "You need to login first" });
    }

    let decoded = jwt.verify(token, process.env.JWT_KEY);

    // Bug #3 fix: Verify the user still exists in the database.
    // A deleted user's old token would otherwise still grant access.
    let userExists;
    if (decoded.role === "admin") {
      userExists = await adminModel.findById(decoded.id).select("_id");
    } else if (decoded.role === "teacher") {
      userExists = await teacherModel.findById(decoded.id).select("_id");
    } else if (decoded.role === "student") {
      userExists = await Student.findById(decoded.id).select("_id");
    }

    if (!userExists) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User no longer exists" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { isAuthenticated };
