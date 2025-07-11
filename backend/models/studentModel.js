const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
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
  role: {
    type: String,
    default: "Student",
  },
  class: {
    name: {
      type: String,
      require: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },
  batch: {
    name: {
      type: String,
      require: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
  },
  profileImage: {
    type: String,
  },
  fees: {
    january: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    february: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    march: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    april: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    may: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    june: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    july: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    august: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    september: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    october: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    november: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    december: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  },
  marks: [
    {
      examRef: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
      score: { type: Number }, // e.g., 18
      outOf: { type: Number }, // e.g., 20
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
