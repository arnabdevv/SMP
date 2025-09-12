import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, BookOpen } from "lucide-react";

const TeacherSidebar = () => {
  const [location] = useLocation();
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/teacher-dashboard" },
    { icon: Users, label: "Student Management", path: "/teacher/students" },
    { icon: BookOpen, label: "Examination", path: "/teacher/exams" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-border fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Teacher Portal
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TeacherSidebar;
