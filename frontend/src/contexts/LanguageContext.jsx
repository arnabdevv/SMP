import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(undefined);

// Translation data
const translations = {
  en: {
    // Common
    "common.login": "Login",
    "common.logout": "Logout",
    "common.dashboard": "Dashboard",
    "common.profile": "Profile",
    "common.settings": "Settings",
    "common.search": "Search",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.error": "Error",
    "common.success": "Success",
    "common.name": "Name",
    "common.email": "Email",
    "common.phone": "Phone",
    "common.date": "Date",
    "common.status": "Status",
    "common.actions": "Actions",
    "common.view": "View",
    "common.filter": "Filter",
    "common.class": "Class",
    "common.batch": "Batch",
    "common.student": "Student",
    "common.students": "Students",
    "common.teacher": "Teacher",
    "common.teachers": "Teachers",
    "common.exam": "Exam",
    "common.exams": "Exams",
    "common.attendance": "Attendance",
    "common.fees": "Fees",
    "common.marks": "Marks",
    "common.subject": "Subject",
    "common.grade": "Grade",
    "common.demoAccounts": "Demo Accounts",
    "common.photo": "Photo",
    "common.selectAll": "Select All",

    // Login
    "login.title": "Welcome Back",
    "login.subtitle": "Sign in to your account",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.signIn": "Sign In",
    "login.invalidCredentials": "Invalid email or password",

    // Navigation
    "nav.home": "Home",
    "nav.classes": "Classes",
    "nav.students": "Students",
    "nav.teachers": "Teachers",
    "nav.exams": "Exams",
    "nav.attendance": "Attendance",
    "nav.fees": "Fees",
    "nav.reports": "Reports",
    "nav.myClasses": "My Classes",
    "nav.myStudents": "My Students",
    "nav.myMarks": "My Marks",
    "nav.myFees": "My Fees",
    "nav.myProfile": "My Profile",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.overview": "Overview",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.quickActions": "Quick Actions",

    // Admin
    "admin.totalStudents": "Total Students",
    "admin.totalTeachers": "Total Teachers",
    "admin.totalClasses": "Total Classes",
    "admin.pendingFees": "Pending Fees",
    "admin.upcomingExams": "Upcoming Exams",
    "admin.classManagement": "Class Management",
    "admin.teacherManagement": "Teacher Management",
    "admin.studentManagement": "Student Management",
    "admin.createClass": "Create Class",
    "admin.manageBatches": "Manage Batches",
    "admin.registerTeacher": "Register Teacher",
    "admin.registerStudent": "Register Student",
    "admin.testReports": "Test Reports",
    "admin.feeRecords": "Fee Records",

    // Teacher
    "teacher.myClasses": "My Classes",
    "teacher.studentList": "Student List",
    "teacher.createExam": "Create Exam",
    "teacher.enterMarks": "Enter Marks",
    "teacher.markAttendance": "Mark Attendance",
    "teacher.assignedClasses": "Assigned Classes",
    "teacher.totalStudents": "Total Students",
    "teacher.upcomingExams": "Upcoming Exams",
    "teacher.recentAttendance": "Recent Attendance",
    "teacher.totalExams": "Total Exams",
    "teacher.selectClassAndBatch": "Select Class and Batch",
    "teacher.selectClassAndBatchDescription":
      "Please select a class and batch to mark attendance for students.",

    // Student
    "student.upcomingExams": "Upcoming Exams",
    "student.recentMarks": "Recent Marks",
    "student.feeStatus": "Fee Status",
    "student.classInfo": "Class Information",
    "student.myMarks": "My Marks",
    "student.myFees": "My Fees",
    "student.myProfile": "My Profile",

    // Forms
    "form.className": "Class Name",
    "form.classDescription": "Class Description",
    "form.batchName": "Batch Name",
    "form.studentName": "Student Name",
    "form.teacherName": "Teacher Name",
    "form.examTitle": "Exam Title",
    "form.totalMarks": "Total Marks",
    "form.duration": "Duration (minutes)",
    "form.examDate": "Exam Date",
    "form.selectClass": "Select Class",
    "form.selectBatch": "Select Batch",
    "form.guardianName": "Guardian Name",
    "form.guardianPhone": "Guardian Phone",
    "form.address": "Address",
    "form.admissionDate": "Admission Date",
    "form.present": "Present",
    "form.absent": "Absent",
    "form.late": "Late",

    // Status
    "status.active": "Active",
    "status.inactive": "Inactive",
    "status.pending": "Pending",
    "status.paid": "Paid",
    "status.overdue": "Overdue",
    "status.present": "Present",
    "status.absent": "Absent",
    "status.late": "Late",

    // Messages
    "message.noStudentsFound": "No students found",
    "message.noTeachersFound": "No teachers found",
    "message.noExamsFound": "No exams found",
    "message.noClassesFound": "No classes found",
    "message.noMarksFound": "No marks found",
    "message.confirmDelete": "Are you sure you want to delete this item?",
    "message.selectClassAndBatch": "Please select class and batch first",
    "message.attendanceSaved": "Attendance saved successfully!",
    "message.errorSavingAttendance":
      "Error saving attendance. Please try again.",
    "message.noStudentsInBatch": "No students found in this batch.",
  },
  bn: {
    // Common
    "common.login": "লগইন",
    "common.logout": "লগআউট",
    "common.dashboard": "ড্যাশবোর্ড",
    "common.profile": "প্রোফাইল",
    "common.settings": "সেটিংস",
    "common.search": "অনুসন্ধান",
    "common.add": "যোগ করুন",
    "common.edit": "সম্পাদনা",
    "common.delete": "মুছে ফেলুন",
    "common.save": "সংরক্ষণ",
    "common.cancel": "বাতিল",
    "common.submit": "জমা দিন",
    "common.back": "পিছনে",
    "common.loading": "লোড হচ্ছে...",
    "common.noData": "কোনো তথ্য নেই",
    "common.error": "ত্রুটি",
    "common.success": "সফল",
    "common.name": "নাম",
    "common.email": "ইমেইল",
    "common.phone": "ফোন",
    "common.date": "তারিখ",
    "common.status": "অবস্থা",
    "common.actions": "কার্যক্রম",
    "common.view": "দেখুন",
    "common.filter": "ফিল্টার",
    "common.class": "শ্রেণি",
    "common.batch": "ব্যাচ",
    "common.student": "শিক্ষার্থী",
    "common.students": "শিক্ষার্থীরা",
    "common.teacher": "শিক্ষক",
    "common.teachers": "শিক্ষকরা",
    "common.exam": "পরীক্ষা",
    "common.exams": "পরীক্ষাসমূহ",
    "common.attendance": "উপস্থিতি",
    "common.fees": "ফি",
    "common.marks": "নম্বর",
    "common.subject": "বিষয়",
    "common.grade": "গ্রেড",
    "common.demoAccounts": "ডেমো অ্যাকাউন্ট",
    "common.photo": "ছবি",
    "common.selectAll": "সব নির্বাচন করুন",

    // Login
    "login.title": "আবার স্বাগতম",
    "login.subtitle": "আপনার অ্যাকাউন্টে সাইন ইন করুন",
    "login.email": "ইমেইল ঠিকানা",
    "login.password": "পাসওয়ার্ড",
    "login.signIn": "সাইন ইন",
    "login.invalidCredentials": "অবৈধ ইমেইল বা পাসওয়ার্ড",

    // Navigation
    "nav.home": "হোম",
    "nav.classes": "শ্রেণিসমূহ",
    "nav.students": "শিক্ষার্থীরা",
    "nav.teachers": "শিক্ষকরা",
    "nav.exams": "পরীক্ষাসমূহ",
    "nav.attendance": "উপস্থিতি",
    "nav.fees": "ফি",
    "nav.reports": "প্রতিবেদন",
    "nav.myClasses": "আমার শ্রেণিসমূহ",
    "nav.myStudents": "আমার শিক্ষার্থীরা",
    "nav.myMarks": "আমার নম্বর",
    "nav.myFees": "আমার ফি",
    "nav.myProfile": "আমার প্রোফাইল",

    // Dashboard
    "dashboard.welcome": "আবার স্বাগতম",
    "dashboard.overview": "সংক্ষিপ্ত বিবরণ",
    "dashboard.recentActivity": "সাম্প্রতিক কার্যক্রম",
    "dashboard.quickActions": "দ্রুত কার্যক্রম",

    // Admin
    "admin.totalStudents": "মোট শিক্ষার্থী",
    "admin.totalTeachers": "মোট শিক্ষক",
    "admin.totalClasses": "মোট শ্রেণি",
    "admin.pendingFees": "বকেয়া ফি",
    "admin.upcomingExams": "আসন্ন পরীক্ষা",
    "admin.classManagement": "শ্রেণি ব্যবস্থাপনা",
    "admin.teacherManagement": "শিক্ষক ব্যবস্থাপনা",
    "admin.studentManagement": "শিক্ষার্থী ব্যবস্থাপনা",
    "admin.createClass": "শ্রেণি তৈরি করুন",
    "admin.manageBatches": "ব্যাচ ব্যবস্থাপনা",
    "admin.registerTeacher": "শিক্ষক নিবন্ধন",
    "admin.registerStudent": "শিক্ষার্থী নিবন্ধন",
    "admin.testReports": "পরীক্ষার প্রতিবেদন",
    "admin.feeRecords": "ফি রেকর্ড",

    // Teacher
    "teacher.myClasses": "আমার শ্রেণিসমূহ",
    "teacher.studentList": "শিক্ষার্থীর তালিকা",
    "teacher.createExam": "পরীক্ষা তৈরি করুন",
    "teacher.enterMarks": "নম্বর প্রবেশ করুন",
    "teacher.markAttendance": "উপস্থিতি চিহ্নিত করুন",
    "teacher.assignedClasses": "নির্ধারিত শ্রেণিসমূহ",
    "teacher.totalStudents": "মোট শিক্ষার্থী",
    "teacher.upcomingExams": "আসন্ন পরীক্ষা",
    "teacher.recentAttendance": "সাম্প্রতিক উপস্থিতি",
    "teacher.totalExams": "মোট পরীক্ষা",
    "teacher.selectClassAndBatch": "শ্রেণি এবং ব্যাচ নির্বাচন করুন",
    "teacher.selectClassAndBatchDescription":
      "শিক্ষার্থীদের উপস্থিতি চিহ্নিত করতে অনুগ্রহ করে একটি শ্রেণি এবং ব্যাচ নির্বাচন করুন।",

    // Student
    "student.upcomingExams": "আসন্ন পরীক্ষা",
    "student.recentMarks": "সাম্প্রতিক নম্বর",
    "student.feeStatus": "ফি অবস্থা",
    "student.classInfo": "শ্রেণির তথ্য",
    "student.myMarks": "আমার নম্বর",
    "student.myFees": "আমার ফি",
    "student.myProfile": "আমার প্রোফাইল",

    // Forms
    "form.className": "শ্রেণির নাম",
    "form.classDescription": "শ্রেণির বিবরণ",
    "form.batchName": "ব্যাচের নাম",
    "form.studentName": "শিক্ষার্থীর নাম",
    "form.teacherName": "শিক্ষকের নাম",
    "form.examTitle": "পরীক্ষার শিরোনাম",
    "form.totalMarks": "মোট নম্বর",
    "form.duration": "সময়কাল (মিনিট)",
    "form.examDate": "পরীক্ষার তারিখ",
    "form.selectClass": "শ্রেণি নির্বাচন করুন",
    "form.selectBatch": "ব্যাচ নির্বাচন করুন",
    "form.guardianName": "অভিভাবকের নাম",
    "form.guardianPhone": "অভিভাবকের ফোন",
    "form.address": "ঠিকানা",
    "form.admissionDate": "ভর্তির তারিখ",
    "form.present": "উপস্থিত",
    "form.absent": "অনুপস্থিত",
    "form.late": "দেরি",

    // Status
    "status.active": "সক্রিয়",
    "status.inactive": "নিষ্ক্রিয়",
    "status.pending": "মুলতবি",
    "status.paid": "পরিশোধিত",
    "status.overdue": "বকেয়া",
    "status.present": "উপস্থিত",
    "status.absent": "অনুপস্থিত",
    "status.late": "দেরি",

    // Messages
    "message.noStudentsFound": "কোনো শিক্ষার্থী পাওয়া যায়নি",
    "message.noTeachersFound": "কোনো শিক্ষক পাওয়া যায়নি",
    "message.noExamsFound": "কোনো পরীক্ষা পাওয়া যায়নি",
    "message.noClassesFound": "কোনো শ্রেণি পাওয়া যায়নি",
    "message.noMarksFound": "কোনো নম্বর পাওয়া যায়নি",
    "message.confirmDelete": "আপনি কি নিশ্চিত যে এই আইটেমটি মুছে ফেলতে চান?",
    "message.selectClassAndBatch":
      "অনুগ্রহ করে প্রথমে শ্রেণি এবং ব্যাচ নির্বাচন করুন",
    "message.attendanceSaved": "উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে!",
    "message.errorSavingAttendance":
      "উপস্থিতি সংরক্ষণে ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    "message.noStudentsInBatch": "এই ব্যাচে কোনো শিক্ষার্থী পাওয়া যায়নি।",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
