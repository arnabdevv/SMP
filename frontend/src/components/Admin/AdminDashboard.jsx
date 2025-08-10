import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import { fetchAdminDashboard } from "../../api/admin";
import StatsCard from "../Common/StatsCard";
import { registerStudent } from "../../api/student";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {

  const { t } = useLanguage();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    parentPhoneNumber: "",
    password: "",
    classRef: "",
    batchRef: "",
  });
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");

  const { students, teachers, classes, fees, exams } = useData();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const pendingFees = fees.filter(
    (fee) => fee.status === "pending" || fee.status === "overdue"
  ).length;
  const upcomingExams = exams.filter(
    (exam) => new Date(exam.date) > new Date()
  ).length;
  // const totalRevenue = fees
  //   .filter((fee) => fee.status === "paid")
  //   .reduce((sum, fee) => sum + fee.amount, 0);

  const stats = [
    {
      title: t("admin.totalStudents"),
      value: totalStudents,
      icon: Users,
      color: "blue",
      change: "+12%",
    },
    {
      title: t("admin.totalTeachers"),
      value: totalTeachers,
      icon: GraduationCap,
      color: "green",
      change: "+5%",
    },
    // {
    //   title: t("admin.totalClasses"),
    //   value: totalClasses,
    //   icon: BookOpen,
    //   color: "purple",
    //   change: "+2%",
    // },
    {
      title: t("admin.pendingFees"),
      value: pendingFees,
      icon: DollarSign,
      color: "yellow",
      change: "-8%",
    },
    {
      title: t("admin.upcomingExams"),
      value: upcomingExams,
      icon: Calendar,
      color: "teal",
      change: "+3%",
    },
    // {
    //   title: "Total Revenue",
    //   value: `৳${totalRevenue.toLocaleString()}`,
    //   icon: TrendingUp,
    //   color: "green",
    //   change: "+15%",
    // },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAdminDashboard();
        setAdminData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>{t("common.loading")}</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">
          {t("dashboard.welcome")},{" "}
          {adminData?.fullName || adminData?.email || "Admin"}!
        </h2>
        <p className="text-gray-600">{adminData?.email}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome")}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType="increase"
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("dashboard.recentActivity")}
          </h3>
          <div className="space-y-3">
            <RecentActivityItem
              color="blue"
              text="New student registered in Class 10"
            />
            <RecentActivityItem
              color="green"
              text="Teacher marked attendance for Batch A"
            />
            <RecentActivityItem
              color="yellow"
              text="New exam scheduled for next week"
            />
            <RecentActivityItem
              color="purple"
              text="Fee payment received from student"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("dashboard.quickActions")}
          </h3>
          <div className="space-y-3">
            <QuickActionButton
              color="blue"
              title={t("admin.createClass")}
              desc="Add a new class to the system"
              textColor="blue"
            />
            <QuickActionButton
              color="green"
              title={t("admin.registerStudent")}
              desc="Register a new student"
              textColor="green"
              onClick={() => setShowStudentModal(true)}
            />
            <QuickActionButton
              color="purple"
              title={t("admin.registerTeacher")}
              desc="Add a new teacher to the system"
              textColor="purple"
            />
          </div>
        </div>
      </div>

      {/* Student Registration Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowStudentModal(false);
                setStudentForm({
                  fullName: "",
                  email: "",
                  phoneNumber: "",
                  parentPhoneNumber: "",
                  password: "",
                  classRef: "",
                  batchRef: "",
                });
                setStudentError("");
                setStudentSuccess("");
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{t("admin.registerStudent")}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStudentLoading(true);
                setStudentError("");
                setStudentSuccess("");
                try {
                  await registerStudent(studentForm);
                  setStudentSuccess("Student registered successfully!");
                  setStudentForm({
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    parentPhoneNumber: "",
                    password: "",
                    classRef: "",
                    batchRef: "",
                  });
                } catch (err) {
                  setStudentError(err?.response?.data?.message || "Registration failed");
                } finally {
                  setStudentLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.fullName}
                  onChange={e => setStudentForm(f => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.email}
                  onChange={e => setStudentForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.phoneNumber}
                  onChange={e => setStudentForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent Phone Number</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.parentPhoneNumber}
                  onChange={e => setStudentForm(f => ({ ...f, parentPhoneNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.password}
                  onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class ID</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.classRef}
                  onChange={e => setStudentForm(f => ({ ...f, classRef: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Batch ID</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={studentForm.batchRef}
                  onChange={e => setStudentForm(f => ({ ...f, batchRef: e.target.value }))}
                  required
                />
              </div>
              {studentError && <div className="text-red-500 text-sm">{studentError}</div>}
              {studentSuccess && <div className="text-green-600 text-sm">{studentSuccess}</div>}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                disabled={studentLoading}
              >
                {studentLoading ? "Registering..." : "Register Student"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for recent activity
function RecentActivityItem({ color, text }) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

// Helper component for quick action buttons
function QuickActionButton({ color, title, desc, textColor, onClick }) {
  return (
    <button
      className={`w-full text-left p-3 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors`}
      onClick={onClick}
    >
      <span className={`text-sm font-medium text-${textColor}-900`}>
        {title}
      </span>
      <p className={`text-xs text-${textColor}-700 mt-1`}>{desc}</p>
    </button>
  );
}

export default AdminDashboard;
