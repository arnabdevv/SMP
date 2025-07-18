import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import DataTable from "../Common/DataTable";
import { Plus } from "lucide-react";

const ClassManagement = () => {
  const { t } = useLanguage();
  const { classes, addClass, addBatch } = useData();
  const [showAddClass, setShowAddClass] = useState(false);
  const [showBatches, setShowBatches] = useState(null);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [batchFormData, setBatchFormData] = useState({
    name: "",
    classId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addClass(formData);
    setFormData({ name: "", description: "" });
    setShowAddClass(false);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const selectedClassObj = classes.find((cls) => cls._id === batchFormData.classId);
    if (selectedClassObj && batchFormData.name.trim()) {
      await addBatch({
        name: batchFormData.name,
        classId: selectedClassObj._id,
      });
      setBatchFormData({ name: "", classId: "" });
      setShowAddBatch(false);
    }
  };

  const classColumns = [
    { key: "name", label: t("common.name") },
    { key: "description", label: t("form.classDescription") },
    {
      key: "batches",
      label: t("common.batch") + "s",
      render: (_, row) => (Array.isArray(row.batches) ? row.batches.length : 0),
    },
    {
      key: "createdAt",
      label: t("common.date"),
      render: (value) => (value ? new Date(value).toLocaleDateString() : ""),
    },
  ];

  const batchColumns = [
    { key: "name", label: t("common.name") },
    {
      key: "createdAt",
      label: t("common.date"),
      render: (value) => (value ? new Date(value).toLocaleDateString() : ""),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.classManagement")}
        </h1>
        <button
          onClick={() => setShowAddClass(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t("admin.createClass")}</span>
        </button>
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.createClass")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("form.className")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Class 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("form.classDescription")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Class description..."
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
                  onClick={() => setShowAddClass(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.manageBatches")}
            </h2>
            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("form.selectClass")}
                </label>
                <select
                  required
                  value={batchFormData.classId}
                  onChange={(e) =>
                    setBatchFormData({
                      ...batchFormData,
                      classId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("form.selectClass")}</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("form.batchName")}
                </label>
                <input
                  type="text"
                  required
                  value={batchFormData.name}
                  onChange={(e) =>
                    setBatchFormData({ ...batchFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Batch A"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  disabled={!batchFormData.classId || !batchFormData.name.trim()}
                >
                  {t("common.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBatch(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {t("nav.classes")}
          </h2>
          <button
            onClick={() => setShowAddBatch(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t("admin.manageBatches")}</span>
          </button>
        </div>
        <DataTable
          columns={classColumns}
          data={classes}
          onView={(row) => setShowBatches(row._id)}
        />
      </div>

      {/* Batches Table */}
      {showBatches && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {t("common.batch")}s -{" "}
              {classes.find((cls) => cls._id === showBatches)?.name}
            </h2>
            <button
              onClick={() => setShowBatches(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <DataTable
            columns={batchColumns}
            data={
              Array.isArray(
                classes.find((cls) => cls._id === showBatches)?.batches
              )
                ? classes.find((cls) => cls._id === showBatches).batches
                : []
            }
          />
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
