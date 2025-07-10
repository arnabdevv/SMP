import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import DataTable from "../Common/DataTable";
import Modal from "../Common/Modal";
import { Search, Filter, Eye } from "lucide-react";

const StudentList = () => {
  const { t } = useLanguage();
  const { students, classes, batches, getBatchesByClass } = useData();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || student.classId === filterClass;
    const matchesBatch = !filterBatch || student.batchId === filterBatch;
    return matchesSearch && matchesClass && matchesBatch;
  });

  const availableBatches = filterClass ? getBatchesByClass(filterClass) : [];

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
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("nav.students")}
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!filterClass}
          >
            <option value="">{t("form.selectBatch")}</option>
            {availableBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredStudents.length} {t("common.students")}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        onView={handleView}
      />

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

export default StudentList;
