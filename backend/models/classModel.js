const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  feeAmount: {
    type: Number,
    required: true,
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
});

module.exports = mongoose.model("Class", classSchema);
