import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import DataTable from "../Common/DataTable";
import Modal from "../Common/Modal";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

const FeeRecords = () => {
  const { t } = useLanguage();
  const {
    fees,
    students,
    classes,
    batches,
    addFee,
    updateFee,
    getBatchesByClass,
  } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    classId: "",
    batchId: "",
    month: "",
    year: new Date().getFullYear(),
    amount: "",
    status: "pending",
    dueDate: "",
    paidDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStudent = students.find((s) => s.id === formData.studentId);

    const feeData = {
      ...formData,
      studentName: selectedStudent?.name || "",
      classId: selectedStudent?.classId || "",
      batchId: selectedStudent?.batchId || "",
      amount: parseFloat(formData.amount),
      year: parseInt(formData.year),
    };

    if (selectedFee) {
      updateFee(selectedFee.id, feeData);
      setShowEditModal(false);
    } else {
      addFee(feeData);
      setShowAddModal(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      studentName: "",
      classId: "",
      batchId: "",
      month: "",
      year: new Date().getFullYear(),
      amount: "",
      status: "pending",
      dueDate: "",
      paidDate: "",
    });
    setSelectedFee(null);
  };

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setFormData(fee);
    setShowEditModal(true);
  };

  const markAsPaid = (fee) => {
    updateFee(fee.id, {
      ...fee,
      status: "paid",
      paidDate: new Date().toISOString().split("T")[0],
    });
  };

  const filteredFees = fees.filter((fee) => {
    const matchesSearch = fee.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || fee.classId === filterClass;
    const matchesBatch = !filterBatch || fee.batchId === filterBatch;
    const matchesStatus = !filterStatus || fee.status === filterStatus;
    return matchesSearch && matchesClass && matchesBatch && matchesStatus;
  });

  const availableBatches = filterClass ? getBatchesByClass(filterClass) : [];

  // Calculate statistics
  const totalRevenue = fees
    .filter((fee) => fee.status === "paid")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = fees
    .filter((fee) => fee.status === "pending")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const overdueAmount = fees
    .filter((fee) => fee.status === "overdue")
    .reduce((sum, fee) => sum + fee.amount, 0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const columns = [
    { key: "studentName", label: t("common.student") },
    {
      key: "classId",
      label: t("common.class"),
      render: (_, row) => {
        const cls = classes.find((c) => c.id === row.classId);
        return cls?.name || "";
      },
    },
    {
      key: "batchId",
      label: t("common.batch"),
      render: (_, row) => {
        const batch = batches.find((b) => b.id === row.batchId);
        return batch?.name || "";
      },
    },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `৳${value.toLocaleString()}`,
    },
    {
      key: "status",
      label: t("common.status"),
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
      key: "dueDate",
      label: "Due Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "paidDate",
      label: "Paid Date",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      key: "actions",
      label: t("common.actions"),
      render: (_, row) =>
        row.status !== "paid" && (
          <button
            onClick={() => markAsPaid(row)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Mark Paid
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.feeRecords")}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Fee Record</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                ৳{pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Overdue Amount
              </p>
              <p className="text-2xl font-bold text-red-600">
                ৳{overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="paid">{t("status.paid")}</option>
            <option value="pending">{t("status.pending")}</option>
            <option value="overdue">{t("status.overdue")}</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredFees.length} records
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <DataTable columns={columns} data={filteredFees} onEdit={handleEdit} />

      {/* Add Fee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Fee Record"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.student")}
              </label>
              <select
                required
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.className} {student.batchName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                required
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                required
                min="2020"
                max="2030"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.status")}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">{t("status.pending")}</option>
                <option value="paid">{t("status.paid")}</option>
                <option value="overdue">{t("status.overdue")}</option>
              </select>
            </div>
          </div>
          {formData.status === "paid" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Date
              </label>
              <input
                type="date"
                value={formData.paidDate}
                onChange={(e) =>
                  setFormData({ ...formData, paidDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
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

      {/* Edit Fee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Fee Record"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.status")}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">{t("status.pending")}</option>
                <option value="paid">{t("status.paid")}</option>
                <option value="overdue">{t("status.overdue")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {formData.status === "paid" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Date
                </label>
                <input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paidDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
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
    </div>
  );
};

export default FeeRecords;
