import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Users, CheckSquare, Square, Save } from "lucide-react";

const Attendance = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    classes,
    batches,
    students,
    attendance,
    addAttendance,
    getBatchesByClass,
    getStudentsByClassAndBatch,
  } = useData();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableBatches = selectedClass
    ? getBatchesByClass(selectedClass)
    : [];
  const classStudents =
    selectedClass && selectedBatch
      ? getStudentsByClassAndBatch(selectedClass, selectedBatch)
      : [];

  // Check if attendance already exists for this date
  const existingAttendance = attendance.filter(
    (att) =>
      att.date === selectedDate &&
      att.classId === selectedClass &&
      att.batchId === selectedBatch
  );

  // Initialize attendance data when class/batch/date changes
  React.useEffect(() => {
    if (classStudents.length > 0) {
      const initialData = {};
      let allPresent = true;

      classStudents.forEach((student) => {
        const existingRecord = existingAttendance.find(
          (att) => att.studentId === student.id
        );
        const isPresent = existingRecord
          ? existingRecord.status === "present"
          : false;
        initialData[student.id] = isPresent;
        if (!isPresent) allPresent = false;
      });

      setAttendanceData(initialData);
      setSelectAll(allPresent && classStudents.length > 0);
    }
  }, [selectedClass, selectedBatch, selectedDate, classStudents.length]);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setSelectedBatch("");
    setAttendanceData({});
    setSelectAll(false);
  };

  const handleBatchChange = (batchId) => {
    setSelectedBatch(batchId);
    setAttendanceData({});
    setSelectAll(false);
  };

  const handleStudentAttendance = (studentId, isPresent) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));

    // Update select all state
    const updatedData = { ...attendanceData, [studentId]: isPresent };
    const allSelected = classStudents.every(
      (student) => updatedData[student.id]
    );
    setSelectAll(allSelected);
  };

  const handleSelectAll = (selectAllValue) => {
    setSelectAll(selectAllValue);
    const newData = {};
    classStudents.forEach((student) => {
      newData[student.id] = selectAllValue;
    });
    setAttendanceData(newData);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedBatch || classStudents.length === 0) {
      alert(t("message.selectClassAndBatch"));
      return;
    }

    setIsLoading(true);

    try {
      // Save attendance for each student
      classStudents.forEach((student) => {
        const attendanceRecord = {
          studentId: student.id,
          studentName: student.name,
          classId: selectedClass,
          batchId: selectedBatch,
          date: selectedDate,
          status: attendanceData[student.id] ? "present" : "absent",
          markedBy: user?.id || "",
        };

        // Check if attendance already exists for this student on this date
        const existingRecord = existingAttendance.find(
          (att) => att.studentId === student.id
        );
        if (!existingRecord) {
          addAttendance(attendanceRecord);
        }
      });

      alert(t("message.attendanceSaved"));
    } catch (error) {
      alert(t("message.errorSavingAttendance"));
    } finally {
      setIsLoading(false);
    }
  };

  const selectedClassName =
    classes.find((cls) => cls.id === selectedClass)?.name || "";
  const selectedBatchName =
    batches.find((batch) => batch.id === selectedBatch)?.name || "";
  const presentCount = Object.values(attendanceData).filter(Boolean).length;
  const absentCount = classStudents.length - presentCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("nav.attendance")}
        </h1>
      </div>

      {/* Selection Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.selectClass")}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("form.selectClass")}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.selectBatch")}
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedClass}
            >
              <option value="">{t("form.selectBatch")}</option>
              {availableBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.date")}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {selectedClass && selectedBatch && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedClassName} - {selectedBatchName}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(selectedDate).toLocaleDateString()} |{" "}
                {classStudents.length} {t("common.students")}
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>
                  {t("status.present")}: {presentCount}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>
                  {t("status.absent")}: {absentCount}
                </span>
              </div>
            </div>
          </div>

          {/* Select All Option */}
          {classStudents.length > 0 && (
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => handleSelectAll(!selectAll)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                {selectAll ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
                <span className="font-medium">{t("common.selectAll")}</span>
              </button>
            </div>
          )}

          {/* Student List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {classStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <button
                  onClick={() =>
                    handleStudentAttendance(
                      student.id,
                      !attendanceData[student.id]
                    )
                  }
                  className="flex items-center space-x-2"
                >
                  {attendanceData[student.id] ? (
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <img
                  src={
                    student.profileImage ||
                    "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"
                  }
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendanceData[student.id]
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {attendanceData[student.id]
                      ? t("status.present")
                      : t("status.absent")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          {classStudents.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAttendance}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>
                  {isLoading ? t("common.loading") : t("common.save")}{" "}
                  {t("nav.attendance")}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {(!selectedClass || !selectedBatch) && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("teacher.selectClassAndBatch")}
          </h3>
          <p className="text-gray-600">
            {t("teacher.selectClassAndBatchDescription")}
          </p>
        </div>
      )}

      {/* No Students State */}
      {selectedClass && selectedBatch && classStudents.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("message.noStudentsFound")}
          </h3>
          <p className="text-gray-600">{t("message.noStudentsInBatch")}</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
