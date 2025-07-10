import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import StatsCard from "../Common/StatsCard";
import { Users, Calendar, UserCheck, FileText } from "lucide-react";

const TeacherDashboard = () => {
  const { t } = useLanguage();
  const { students, exams, attendance } = useData();
  const { user } = useAuth();

  // Get teacher's data
  const teacherExams = exams.filter((exam) => exam.createdBy === user?.id);
  const todayAttendance = attendance.filter(
    (att) =>
      att.date === new Date().toISOString().split("T")[0] &&
      att.markedBy === user?.id
  );

  const stats = [
    {
      title: t("teacher.totalStudents"),
      value: students.length,
      icon: Users,
      color: "green",
    },
    {
      title: t("teacher.upcomingExams"),
      value: teacherExams.filter((exam) => new Date(exam.date) > new Date())
        .length,
      icon: Calendar,
      color: "purple",
    },
    {
      title: t("teacher.recentAttendance"),
      value: todayAttendance.length,
      icon: UserCheck,
      color: "teal",
    },
    {
      title: t("teacher.totalExams"),
      value: teacherExams.length,
      icon: FileText,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome")}, {user?.name}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("teacher.upcomingExams")}
          </h3>
          <div className="space-y-3">
            {teacherExams
              .filter((exam) => new Date(exam.date) > new Date())
              .slice(0, 3)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <p className="text-sm text-gray-600">{exam.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {exam.date}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exam.totalMarks} marks
                    </p>
                  </div>
                </div>
              ))}
            {teacherExams.filter((exam) => new Date(exam.date) > new Date())
              .length === 0 && (
              <p className="text-sm text-gray-500">
                {t("message.noExamsFound")}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("dashboard.quickActions")}
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-blue-900">
                {t("teacher.createExam")}
              </span>
              <p className="text-xs text-blue-700 mt-1">
                Create a new exam for your class
              </p>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-green-900">
                {t("teacher.markAttendance")}
              </span>
              <p className="text-xs text-green-700 mt-1">
                Mark today's attendance
              </p>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-purple-900">
                {t("teacher.enterMarks")}
              </span>
              <p className="text-xs text-purple-700 mt-1">Enter exam marks</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
