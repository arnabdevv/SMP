import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import { fetchAdminDashboard } from "../../api/admin";
import StatsCard from "../Common/StatsCard";
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
function QuickActionButton({ color, title, desc, textColor }) {
  return (
    <button
      className={`w-full text-left p-3 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors`}
    >
      <span className={`text-sm font-medium text-${textColor}-900`}>
        {title}
      </span>
      <p className={`text-xs text-${textColor}-700 mt-1`}>{desc}</p>
    </button>
  );
}

export default AdminDashboard;
