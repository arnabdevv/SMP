import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import DataTable from "../Common/DataTable";
import Modal from "../Common/Modal";
import { Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react";

const TeacherManagement = () => {
  const { t } = useLanguage();
  const {
    teachers,
    classes,
    batches,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    assignedClasses: [],
    assignedBatches: [],
    profileImage: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTeacher) {
      updateTeacher(selectedTeacher.id, formData);
      setShowEditModal(false);
    } else {
      addTeacher(formData);
      setShowAddModal(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      assignedClasses: [],
      assignedBatches: [],
      profileImage: "",
    });
    setSelectedTeacher(null);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData(teacher);
    setShowEditModal(true);
  };

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const handleDelete = (teacher) => {
    if (window.confirm(t("message.confirmDelete"))) {
      deleteTeacher(teacher.id);
    }
  };

  const handleClassAssignment = (classId, isChecked) => {
    if (isChecked) {
      setFormData({
        ...formData,
        assignedClasses: [...formData.assignedClasses, classId],
      });
    } else {
      setFormData({
        ...formData,
        assignedClasses: formData.assignedClasses.filter(
          (id) => id !== classId
        ),
        assignedBatches: formData.assignedBatches.filter((batchId) => {
          const batch = batches.find((b) => b.id === batchId);
          return batch?.classId !== classId;
        }),
      });
    }
  };

  const handleBatchAssignment = (batchId, isChecked) => {
    if (isChecked) {
      setFormData({
        ...formData,
        assignedBatches: [...formData.assignedBatches, batchId],
      });
    } else {
      setFormData({
        ...formData,
        assignedBatches: formData.assignedBatches.filter(
          (id) => id !== batchId
        ),
      });
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "profileImage",
      label: t("common.photo"),
      render: (value, row) => (
        <img
          src={
            value ||
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
          }
          alt={row.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { key: "name", label: t("common.name") },
    { key: "email", label: t("common.email") },
    { key: "subject", label: t("common.subject") },
    { key: "phone", label: t("common.phone") },
    {
      key: "assignedClasses",
      label: t("nav.classes"),
      render: (value) => value.length,
    },
    {
      key: "assignedBatches",
      label: t("common.batch") + "s",
      render: (value) => value.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.teacherManagement")}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t("admin.registerTeacher")}</span>
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

      {/* Teachers Table */}
      <DataTable
        columns={columns}
        data={filteredTeachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Add Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={t("admin.registerTeacher")}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.teacherName")}
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
                placeholder="Mathematics, Physics, etc."
              />
            </div>
          </div>

          {/* Class Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("teacher.assignedClasses")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
              {classes.map((cls) => (
                <label key={cls.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.assignedClasses.includes(cls.id)}
                    onChange={(e) =>
                      handleClassAssignment(cls.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{cls.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Batch Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.batch")}s
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
              {batches
                .filter((batch) =>
                  formData.assignedClasses.includes(batch.classId)
                )
                .map((batch) => (
                  <label key={batch.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedBatches.includes(batch.id)}
                      onChange={(e) =>
                        handleBatchAssignment(batch.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {batch.className} - {batch.name}
                    </span>
                  </label>
                ))}
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

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title={t("common.edit") + " " + t("common.teacher")}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.teacherName")}
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
          </div>

          {/* Class Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("teacher.assignedClasses")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
              {classes.map((cls) => (
                <label key={cls.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.assignedClasses.includes(cls.id)}
                    onChange={(e) =>
                      handleClassAssignment(cls.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{cls.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Batch Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.batch")}s
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
              {batches
                .filter((batch) =>
                  formData.assignedClasses.includes(batch.classId)
                )
                .map((batch) => (
                  <label key={batch.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedBatches.includes(batch.id)}
                      onChange={(e) =>
                        handleBatchAssignment(batch.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {batch.className} - {batch.name}
                    </span>
                  </label>
                ))}
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

      {/* View Teacher Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={t("common.view") + " " + t("common.teacher")}
      >
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  selectedTeacher.profileImage ||
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                }
                alt={selectedTeacher.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTeacher.name}
                </h3>
                <p className="text-gray-600">{selectedTeacher.subject}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("common.email")}
                </label>
                <p className="text-gray-900">{selectedTeacher.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("common.phone")}
                </label>
                <p className="text-gray-900">{selectedTeacher.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("teacher.assignedClasses")}
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTeacher.assignedClasses.map((classId) => {
                  const cls = classes.find((c) => c.id === classId);
                  return cls ? (
                    <span
                      key={classId}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {cls.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("common.batch")}s
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTeacher.assignedBatches.map((batchId) => {
                  const batch = batches.find((b) => b.id === batchId);
                  return batch ? (
                    <span
                      key={batchId}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {batch.className} - {batch.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherManagement;
