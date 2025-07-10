import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { icon: Home, label: t("nav.home"), path: "/admin/dashboard" },
          { icon: BookOpen, label: t("nav.classes"), path: "/admin/classes" },
          { icon: Users, label: t("nav.students"), path: "/admin/students" },
          {
            icon: GraduationCap,
            label: t("nav.teachers"),
            path: "/admin/teachers",
          },
          { icon: FileText, label: t("nav.exams"), path: "/admin/test-marks" },
          {
            icon: DollarSign,
            label: t("nav.fees"),
            path: "/admin/fee-records",
          },
          { icon: BarChart3, label: t("nav.reports"), path: "/admin/reports" },
        ];
      case "teacher":
        return [
          { icon: Home, label: t("nav.home"), path: "/teacher/dashboard" },
          { icon: Users, label: t("nav.students"), path: "/teacher/students" },
          { icon: FileText, label: t("nav.exams"), path: "/teacher/exams" },
          {
            icon: UserCheck,
            label: t("nav.attendance"),
            path: "/teacher/attendance",
          },
        ];
      case "student":
        return [
          { icon: Home, label: t("nav.home"), path: "/student/dashboard" },
          { icon: FileText, label: t("nav.myMarks"), path: "/student/marks" },
          { icon: DollarSign, label: t("nav.myFees"), path: "/student/fees" },
          {
            icon: Settings,
            label: t("nav.myProfile"),
            path: "/student/profile",
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {language === "en" ? "EduPortal" : "শিক্ষা পোর্টাল"}
          </h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
