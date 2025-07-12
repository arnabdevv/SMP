const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    default: "teacher",
  },
});

module.exports = mongoose.model("teacher", teacherSchema);
