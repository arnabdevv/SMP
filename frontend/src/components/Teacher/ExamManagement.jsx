import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../Common/DataTable";
import Modal from "../Common/Modal";
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";

const ExamManagement = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    exams,
    classes,
    batches,
    students,
    marks,
    addExam,
    updateExam,
    deleteExam,
    addMark,
    updateMark,
    getBatchesByClass,
  } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    classId: "",
    className: "",
    batchId: "",
    batchName: "",
    date: "",
    totalMarks: "",
    duration: "",
    createdBy: user?.id || "",
  });
  const [marksData, setMarksData] = useState([]);

  // Filter exams for current teacher
  const teacherExams = exams.filter((exam) => exam.createdBy === user?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClass = classes.find((cls) => cls.id === formData.classId);
    const selectedBatch = batches.find(
      (batch) => batch.id === formData.batchId
    );

    const examData = {
      ...formData,
      className: selectedClass?.name || "",
      batchName: selectedBatch?.name || "",
      totalMarks: parseInt(formData.totalMarks),
      duration: parseInt(formData.duration),
    };

    if (selectedExam) {
      updateExam(selectedExam.id, examData);
      setShowEditModal(false);
    } else {
      addExam(examData);
      setShowAddModal(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      classId: "",
      className: "",
      batchId: "",
      batchName: "",
      date: "",
      totalMarks: "",
      duration: "",
      createdBy: user?.id || "",
    });
    setSelectedExam(null);
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setFormData(exam);
    setShowEditModal(true);
  };

  const handleDelete = (exam) => {
    if (window.confirm(t("message.confirmDelete"))) {
      deleteExam(exam.id);
    }
  };

  const handleManageMarks = (exam) => {
    setSelectedExam(exam);
    const examStudents = students.filter(
      (student) =>
        student.classId === exam.classId && student.batchId === exam.batchId
    );

    const existingMarks = marks.filter((mark) => mark.examId === exam.id);

    const marksArray = examStudents.map((student) => {
      const existingMark = existingMarks.find(
        (mark) => mark.studentId === student.id
      );
      return {
        studentId: student.id,
        studentName: student.name,
        marksObtained: existingMark?.marksObtained || "",
        grade: existingMark?.grade || "",
        id: existingMark?.id || null,
      };
    });

    setMarksData(marksArray);
    setShowMarksModal(true);
  };

  const handleMarksSubmit = () => {
    marksData.forEach((markEntry) => {
      if (markEntry.marksObtained !== "") {
        const markData = {
          studentId: markEntry.studentId,
          studentName: markEntry.studentName,
          examId: selectedExam.id,
          examTitle: selectedExam.title,
          marksObtained: parseInt(markEntry.marksObtained),
          totalMarks: selectedExam.totalMarks,
          grade: markEntry.grade,
          classId: selectedExam.classId,
          batchId: selectedExam.batchId,
        };

        if (markEntry.id) {
          updateMark(markEntry.id, markData);
        } else {
          addMark(markData);
        }
      }
    });

    setShowMarksModal(false);
    setMarksData([]);
  };

  const updateMarkEntry = (studentId, field, value) => {
    setMarksData((prev) =>
      prev.map((mark) =>
        mark.studentId === studentId ? { ...mark, [field]: value } : mark
      )
    );
  };

  const calculateGrade = (obtained, total) => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const filteredExams = teacherExams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "title", label: t("form.examTitle") },
    { key: "subject", label: t("common.subject") },
    { key: "className", label: t("common.class") },
    { key: "batchName", label: t("common.batch") },
    {
      key: "date",
      label: t("form.examDate"),
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "totalMarks", label: t("form.totalMarks") },
    {
      key: "duration",
      label: t("form.duration"),
      render: (value) => `${value} min`,
    },
    {
      key: "actions",
      label: t("common.actions"),
      render: (_, row) => (
        <button
          onClick={() => handleManageMarks(row)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          {t("teacher.enterMarks")}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t("nav.exams")}</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t("teacher.createExam")}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Exams Table */}
      <DataTable
        columns={columns}
        data={filteredExams}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Exam Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={t("teacher.createExam")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.examTitle")}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.subject")}
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.selectClass")}
              </label>
              <select
                required
                value={formData.classId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    batchId: "",
                  });
                }}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.selectBatch")}
              </label>
              <select
                required
                value={formData.batchId}
                onChange={(e) =>
                  setFormData({ ...formData, batchId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.classId}
              >
                <option value="">{t("form.selectBatch")}</option>
                {getBatchesByClass(formData.classId).map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.examDate")}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.totalMarks")}
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalMarks}
                onChange={(e) =>
                  setFormData({ ...formData, totalMarks: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.duration")} (minutes)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              {t("common.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Exam Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title={t("common.edit") + " " + t("common.exam")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.examTitle")}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.subject")}
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.examDate")}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.totalMarks")}
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalMarks}
                onChange={(e) =>
                  setFormData({ ...formData, totalMarks: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.duration")} (minutes)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              {t("common.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Marks Entry Modal */}
      <Modal
        isOpen={showMarksModal}
        onClose={() => setShowMarksModal(false)}
        title={`${t("teacher.enterMarks")} - ${selectedExam?.title}`}
        size="large"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{selectedExam?.title}</h3>
            <p className="text-sm text-gray-600">
              {selectedExam?.className} - {selectedExam?.batchName} | Total
              Marks: {selectedExam?.totalMarks}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("common.student")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("common.marks")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("common.grade")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marksData.map((mark) => (
                  <tr key={mark.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {mark.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max={selectedExam?.totalMarks}
                        value={mark.marksObtained}
                        onChange={(e) => {
                          const obtained = parseInt(e.target.value) || 0;
                          const grade =
                            obtained > 0
                              ? calculateGrade(
                                  obtained,
                                  selectedExam?.totalMarks
                                )
                              : "";
                          updateMarkEntry(
                            mark.studentId,
                            "marksObtained",
                            e.target.value
                          );
                          updateMarkEntry(mark.studentId, "grade", grade);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500 ml-1">
                        / {selectedExam?.totalMarks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          mark.grade === "A+"
                            ? "bg-green-100 text-green-800"
                            : mark.grade === "A"
                            ? "bg-blue-100 text-blue-800"
                            : mark.grade === "B"
                            ? "bg-yellow-100 text-yellow-800"
                            : mark.grade === "C"
                            ? "bg-orange-100 text-orange-800"
                            : mark.grade === "D"
                            ? "bg-red-100 text-red-800"
                            : mark.grade === "F"
                            ? "bg-red-200 text-red-900"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {mark.grade || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleMarksSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              {t("common.save")} {t("common.marks")}
            </button>
            <button
              onClick={() => setShowMarksModal(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExamManagement;
