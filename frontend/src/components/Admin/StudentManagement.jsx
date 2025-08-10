import React, { useState } from "react";
import { registerStudent, fetchStudents } from "../../api/student";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import DataTable from "../Common/DataTable";
import Modal from "../Common/Modal";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";

const StudentManagement = () => {
  const { t } = useLanguage();
  const { classes, getBatchesByClass, fetchClasses } = useData();
  const [students, setStudents] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    parentPhoneNumber: "",
    password: "",
    classId: "",
    batchId: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    feeStatus: "paid",
  });
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");

  // Fetch classes on mount if needed
  React.useEffect(() => {
    if (!classes || classes.length === 0) {
      if (typeof fetchClasses === "function") fetchClasses();
    }
  }, [classes, fetchClasses]);

  // Fetch all students on mount
  React.useEffect(() => {
    const fetchAll = async () => {
      setViewLoading(true);
      try {
        const students = await fetchStudents();
        setStudents(students);
      } catch {
        setStudents([]);
      } finally {
        setViewLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStudentError("");
    setStudentSuccess("");
    // Validate all required fields
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "parentPhoneNumber",
      "password",
      "classId",
      "batchId",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === "") {
        setStudentError("All fields are required.");
        return;
      }
    }
    setStudentLoading(true);
    try {
      await registerStudent(formData);
      setStudentSuccess("Student registered successfully!");
      setShowAddModal(false);
      resetForm();
      // Refresh students list from backend
      const students = await fetchStudents();
      setStudents(students);
    } catch (err) {
      setStudentError(err?.response?.data?.message || "Registration failed");
    } finally {
      setStudentLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      parentPhoneNumber: "",
      password: "",
      classId: "",
      batchId: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      feeStatus: "paid",
    });
    setSelectedStudent(null);
  };

  // Edit modal is not implemented to update backend, so just fill form for now
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName || student.name || "",
      email: student.email || "",
      phoneNumber: student.phoneNumber || student.phone || "",
      parentPhoneNumber:
        student.parentPhoneNumber || student.guardianPhone || "",
      password: "", // Do not prefill password
      classId:
        student.classRef?._id || student.classId || student.class_id || "",
      batchId:
        student.batchRef?._id || student.batchId || student.batch_id || "",
      address: student.address || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.parentPhoneNumber || student.guardianPhone || "",
      feeStatus: student.feeStatus || "paid",
    });
    setShowEditModal(true);
  };

  const handleView = (student) => {
    setSelectedStudent({
      ...student,
      name: student.fullName || student.name || "",
      className: student.classRef?.name || student.className || "",
      batchName: student.batchRef?.name || student.batchName || "",
      phone: student.phoneNumber || student.phone || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.parentPhoneNumber || student.guardianPhone || "",
      address: student.address || "",
      feeStatus: student.feeStatus || "paid",
      admissionDate: student.admissionDate,
    });
    setShowViewModal(true);
  };

  // Delete is not implemented for backend, so just show alert for now
  const handleDelete = (student) => {
    alert("Delete functionality is not implemented yet.");
  };

  // Only filter by search term on the loaded students
  const filteredStudents = students
    .map((student) => ({
      ...student,
      name: student.fullName || student.name || "",
      className: student.classRef?.name || student.className || "",
      batchName: student.batchRef?.name || student.batchName || "",
      phone: student.phoneNumber || student.phone || "",
      feeStatus: student.feeStatus || "paid",
      admissionDate: student.admissionDate,
    }))
    .filter((student) => {
      const matchesSearch =
        (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  // For Add Student modal, use formData.classId; for filter, use filterClass
  const availableBatches = formData.classId
    ? getBatchesByClass(formData.classId)
    : [];

  const columns = [
    {
      key: "profileImage",
      label: t("common.photo"),
      render: (value, row) => (
        <img
          src={
            value ||
            "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
          }
          alt={row.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { key: "name", label: t("common.name") },
    { key: "email", label: t("common.email") },
    { key: "className", label: t("common.class") },
    { key: "batchName", label: t("common.batch") },
    { key: "phone", label: t("common.phone") },
    {
      key: "feeStatus",
      label: t("student.feeStatus"),
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "paid"
              ? "bg-green-100 text-green-800"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {t(`status.${value}`)}
        </span>
      ),
    },
    {
      key: "admissionDate",
      label: t("form.admissionDate"),
      render: (value) => (value ? new Date(value).toLocaleDateString() : ""),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.studentManagement")}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t("admin.registerStudent")}</span>
        </button>
      </div>

      {/* Filters & Show Button */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setFilterBatch("");
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("form.selectClass")}</option>
            {classes && classes.length > 0 ? (
              classes.map((cls) => (
                <option key={cls._id || cls.id} value={cls._id || cls.id}>
                  {cls.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {t("common.noData") || "No classes available"}
              </option>
            )}
          </select>
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!filterClass}
          >
            <option value="">{t("form.selectBatch")}</option>
            {filterClass &&
              getBatchesByClass(filterClass).map((batch) => (
                <option
                  key={batch._id || batch.id}
                  value={batch._id || batch.id}
                >
                  {batch.name}
                </option>
              ))}
          </select>
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
              !filterClass && !filterBatch
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={async () => {
              setViewLoading(true);
              try {
                const students = await fetchStudents(filterClass, filterBatch);
                setStudents(students);
              } catch (err) {
                setStudents([]);
              } finally {
                setViewLoading(false);
              }
            }}
            disabled={!filterClass && !filterBatch}
          >
            {t("common.show")}
          </button>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredStudents.length} {t("common.students")}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={viewLoading ? [] : filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={t("admin.registerStudent")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.parentPhoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentPhoneNumber: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                required
                value={formData.classId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    batchId: "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id || cls.id} value={cls._id || cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch
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
                <option value="">Select Batch</option>
                {formData.classId &&
                  getBatchesByClass(formData.classId).map((batch) => (
                    <option
                      key={batch._id || batch.id}
                      value={batch._id || batch.id}
                    >
                      {batch.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {studentError && (
            <div className="text-red-500 text-sm">{studentError}</div>
          )}
          {studentSuccess && (
            <div className="text-green-600 text-sm">{studentSuccess}</div>
          )}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              disabled={studentLoading}
            >
              {studentLoading ? "Registering..." : t("common.save")}
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

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title={t("common.edit") + " " + t("common.student")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.studentName")}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.email")}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.phone")}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.guardianName")}
              </label>
              <input
                type="text"
                required
                value={formData.guardianName}
                onChange={(e) =>
                  setFormData({ ...formData, guardianName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.guardianPhone")}
              </label>
              <input
                type="tel"
                required
                value={formData.guardianPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guardianPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("student.feeStatus")}
              </label>
              <select
                value={formData.feeStatus}
                onChange={(e) =>
                  setFormData({ ...formData, feeStatus: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="paid">{t("status.paid")}</option>
                <option value="pending">{t("status.pending")}</option>
                <option value="overdue">{t("status.overdue")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.address")}
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
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

      {/* View Student Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={t("common.view") + " " + t("common.student")}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  selectedStudent.profileImage ||
                  "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                }
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedStudent.name}
                </h3>
                <p className="text-gray-600">
                  {selectedStudent.className} - {selectedStudent.batchName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("common.email")}
                </label>
                <p className="text-gray-900">{selectedStudent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("common.phone")}
                </label>
                <p className="text-gray-900">{selectedStudent.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.guardianName")}
                </label>
                <p className="text-gray-900">{selectedStudent.guardianName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.guardianPhone")}
                </label>
                <p className="text-gray-900">{selectedStudent.guardianPhone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.admissionDate")}
                </label>
                <p className="text-gray-900">
                  {new Date(selectedStudent.admissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("student.feeStatus")}
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedStudent.feeStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : selectedStudent.feeStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {t(`status.${selectedStudent.feeStatus}`)}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("form.address")}
              </label>
              <p className="text-gray-900">{selectedStudent.address}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;
