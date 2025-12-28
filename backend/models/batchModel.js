const mongoose = require("mongoose");

const batchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    classRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    academicYear: {
      type: String,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);
