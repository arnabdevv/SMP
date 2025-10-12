const debug = require("debug")("development:app");

const adminModel = require("../../models/adminModel");
const classModel = require("../../models/classModel");
const { Student, Fees } = require("../../models/studentModel");
const teacherModel = require("../../models/teacherModel");
const summarizeUnpaidMonths = require("../../utils/utils");

const dashboard = async (req, res) => {
  const user = req.user;
  let userData;

  try {
    if (user.role === "admin") {
      userData = await adminModel.findOne({ _id: user.id }).select("-password");
    } else if (user.role === "teacher") {
      userData = await teacherModel
        .findOne({ _id: user.id })
        .select("-password -_id -__v")
        .lean();

      let classData = await classModel
        .find()
        .select("name feeAmount -_id")
        .populate({ path: "batches", select: "name students -_id" })
        .lean();
      // console.log(classData);

      // Create a map of className → feeAmount
      const classFeeMap = {};
      classData.forEach((cls) => {
        classFeeMap[cls.name] = Number(cls.feeAmount);
      });

      const result = classData.map((cls) => ({
        className: cls.name,
        // feeAmount: cls.feeAmount,
        batches: cls.batches.map((batch) => ({
          batchName: batch.name,
          studentCount: batch.students.length,
        })),
      }));

      // Merge classes info into teacher data
      userData.classes = result;

      const feeData = await Fees.find({})
        .select("-_id -__V")
        .populate({
          path: "stdId",
          select: "batchRef classRef -_id",
          populate: [
            { path: "batchRef", select: "name -_id" },
            { path: "classRef", select: "name feeAmount -_id" },
          ],
        });
      const report = summarizeUnpaidMonths(feeData, classFeeMap);

      // Merge feeData info into teacher data
      userData.feeData = report;
    } else if (user.role === "student") {
      userData = await Student.findOne({ _id: user.id })
        .select("-password -_id")
        .populate("classRef", "name -_id")
        .populate("batchRef", "name -_id")
        .populate("fees", "monthlyFees -_id");
    } else {
      return res.status(400).json({ message: "Invalid Role" });
    }

    if (!userData) {
      return res.status(404).json({ message: "You need to login first" });
    }

    res.send(userData);
  } catch (err) {
    debug(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { dashboard };
