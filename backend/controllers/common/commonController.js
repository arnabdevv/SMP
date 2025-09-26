const debug = require("debug")("development:app");

const adminModel = require("../../models/adminModel");
const studentModel = require("../../models/studentModel");
const teacherModel = require("../../models/teacherModel");

const dashboard = async (req, res) => {
  const user = req.user;
  let userData;
  try {
    if (user.role === "admin") {
      userData = await adminModel.findOne({ _id: user.id }).select("-password");
    } else if (user.role === "teacher") {
      userData = await teacherModel
        .findOne({ _id: user.id })
        .select("-password");
    } else if (user.role === "student") {
      userData = await studentModel
        .findOne({ _id: user.id })
        .select("-password")
        .populate("classRef", "name -_id") // only get name of class
        .populate("batchRef", "name -_id"); // only get name of batch
    } else {
      return res.status(400).json({ message: "Invalid Role" });
    }

    if (!userData) {
      return res.status(404).json({ message: "You need to login first" });
    }

    res.send(userData);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
    debug(err);
  }
};

module.exports = { dashboard };
