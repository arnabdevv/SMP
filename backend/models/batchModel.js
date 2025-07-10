const mongoose = require("mongoose");

const batchSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = mongoose.model("Batch", batchSchema);
