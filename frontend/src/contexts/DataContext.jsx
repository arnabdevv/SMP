import React, { createContext, useContext, useState } from "react";

const DataContext = createContext(undefined);

// Mock data
const mockClasses = [
  {
    id: "1",
    name: "Class 10",
    description: "Secondary level class",
    batches: [],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Class 11",
    description: "Higher secondary level class",
    batches: [],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Class 12",
    description: "Higher secondary final class",
    batches: [],
    createdAt: "2024-01-15T10:00:00Z",
  },
];

const mockBatches = [
  {
    id: "1",
    name: "Batch A",
    classId: "1",
    className: "Class 10",
    studentCount: 25,
    teacherIds: ["1", "2"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Batch B",
    classId: "1",
    className: "Class 10",
    studentCount: 23,
    teacherIds: ["1", "3"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    name: "Batch A",
    classId: "2",
    className: "Class 11",
    studentCount: 28,
    teacherIds: ["2", "3"],
    createdAt: "2024-01-15T10:30:00Z",
  },
];

const mockStudents = [
  {
    id: "1",
    name: "রাহুল আহমেদ",
    email: "rahul@student.com",
    phone: "01712345678",
    classId: "1",
    className: "Class 10",
    batchId: "1",
    batchName: "Batch A",
    profileImage:
      "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    guardianName: "মোহাম্মদ আহমেদ",
    guardianPhone: "01712345679",
    address: "ঢাকা, বাংলাদেশ",
    admissionDate: "2024-01-10",
    feeStatus: "paid",
  },
  {
    id: "2",
    name: "ফাতিমা খান",
    email: "fatima@student.com",
    phone: "01712345680",
    classId: "1",
    className: "Class 10",
    batchId: "1",
    batchName: "Batch A",
    profileImage:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    guardianName: "আবুল খান",
    guardianPhone: "01712345681",
    address: "চট্টগ্রাম, বাংলাদেশ",
    admissionDate: "2024-01-12",
    feeStatus: "pending",
  },
  {
    id: "3",
    name: "করিম উদ্দিন",
    email: "karim@student.com",
    phone: "01712345682",
    classId: "1",
    className: "Class 10",
    batchId: "2",
    batchName: "Batch B",
    profileImage:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    guardianName: "সালাম উদ্দিন",
    guardianPhone: "01712345683",
    address: "সিলেট, বাংলাদেশ",
    admissionDate: "2024-01-14",
    feeStatus: "overdue",
  },
  {
    id: "4",
    name: "সারা বেগম",
    email: "sara@student.com",
    phone: "01712345684",
    classId: "2",
    className: "Class 11",
    batchId: "3",
    batchName: "Batch A",
    profileImage:
      "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    guardianName: "আলী বেগ",
    guardianPhone: "01712345685",
    address: "রাজশাহী, বাংলাদেশ",
    admissionDate: "2024-01-16",
    feeStatus: "paid",
  },
  {
    id: "5",
    name: "তানভীর হাসান",
    email: "tanvir@student.com",
    phone: "01712345686",
    classId: "2",
    className: "Class 11",
    batchId: "3",
    batchName: "Batch A",
    profileImage:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    guardianName: "রফিক হাসান",
    guardianPhone: "01712345687",
    address: "খুলনা, বাংলাদেশ",
    admissionDate: "2024-01-18",
    feeStatus: "pending",
  },
];

const mockTeachers = [
  {
    id: "1",
    name: "প্রফেসর রহিম",
    email: "rahim@teacher.com",
    phone: "01712345684",
    subject: "গণিত",
    assignedClasses: ["1", "2"],
    assignedBatches: ["1", "2", "3"],
    profileImage:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
  },
  {
    id: "2",
    name: "ডাঃ সালমা",
    email: "salma@teacher.com",
    phone: "01712345685",
    subject: "পদার্থবিজ্ঞান",
    assignedClasses: ["1", "2"],
    assignedBatches: ["1", "3"],
    profileImage:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
  },
  {
    id: "3",
    name: "মিস্টার জাহিদ",
    email: "zahid@teacher.com",
    phone: "01712345686",
    subject: "রসায়ন",
    assignedClasses: ["1", "2"],
    assignedBatches: ["2", "3"],
    profileImage:
      "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
  },
];

const mockExams = [
  {
    id: "1",
    title: "গণিত মিডটার্ম",
    subject: "গণিত",
    classId: "1",
    className: "Class 10",
    batchId: "1",
    batchName: "Batch A",
    date: "2024-02-15",
    totalMarks: 100,
    duration: 120,
    createdBy: "1",
  },
  {
    id: "2",
    title: "পদার্থবিজ্ঞান চূড়ান্ত",
    subject: "পদার্থবিজ্ঞান",
    classId: "1",
    className: "Class 10",
    batchId: "1",
    batchName: "Batch A",
    date: "2024-02-20",
    totalMarks: 100,
    duration: 180,
    createdBy: "2",
  },
];

const mockMarks = [
  {
    id: "1",
    studentId: "1",
    studentName: "রাহুল আহমেদ",
    examId: "1",
    examTitle: "গণিত মিডটার্ম",
    marksObtained: 85,
    totalMarks: 100,
    grade: "A",
    classId: "1",
    batchId: "1",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "ফাতিমা খান",
    examId: "1",
    examTitle: "গণিত মিডটার্ম",
    marksObtained: 92,
    totalMarks: 100,
    grade: "A+",
    classId: "1",
    batchId: "1",
  },
];

const mockAttendance = [
  {
    id: "1",
    studentId: "1",
    studentName: "রাহুল আহমেদ",
    classId: "1",
    batchId: "1",
    date: "2024-01-20",
    status: "present",
    markedBy: "1",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "ফাতিমা খান",
    classId: "1",
    batchId: "1",
    date: "2024-01-20",
    status: "present",
    markedBy: "1",
  },
];

const mockFees = [
  {
    id: "1",
    studentId: "1",
    studentName: "রাহুল আহমেদ",
    classId: "1",
    batchId: "1",
    month: "January",
    year: 2024,
    amount: 5000,
    status: "paid",
    paidDate: "2024-01-15",
    dueDate: "2024-01-10",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "ফাতিমা খান",
    classId: "1",
    batchId: "1",
    month: "January",
    year: 2024,
    amount: 5000,
    status: "pending",
    dueDate: "2024-01-10",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "করিম উদ্দিন",
    classId: "1",
    batchId: "2",
    month: "January",
    year: 2024,
    amount: 5000,
    status: "overdue",
    dueDate: "2024-01-10",
  },
];

export const DataProvider = ({ children }) => {
  const [classes, setClasses] = useState(mockClasses);
  const [batches, setBatches] = useState(mockBatches);
  const [students, setStudents] = useState(mockStudents);
  const [teachers, setTeachers] = useState(mockTeachers);
  const [exams, setExams] = useState(mockExams);
  const [marks, setMarks] = useState(mockMarks);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [fees, setFees] = useState(mockFees);

  const addClass = (classData) => {
    const newClass = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const addBatch = (batchData) => {
    const newBatch = {
      ...batchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBatches((prev) => [...prev, newBatch]);
  };

  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id, studentData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...studentData } : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const addTeacher = (teacherData) => {
    const newTeacher = {
      ...teacherData,
      id: Date.now().toString(),
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id, teacherData) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, ...teacherData } : teacher
      )
    );
  };

  const deleteTeacher = (id) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  };

  const addExam = (examData) => {
    const newExam = {
      ...examData,
      id: Date.now().toString(),
    };
    setExams((prev) => [...prev, newExam]);
  };

  const updateExam = (id, examData) => {
    setExams((prev) =>
      prev.map((exam) => (exam.id === id ? { ...exam, ...examData } : exam))
    );
  };

  const deleteExam = (id) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const addMark = (markData) => {
    const newMark = {
      ...markData,
      id: Date.now().toString(),
    };
    setMarks((prev) => [...prev, newMark]);
  };

  const updateMark = (id, markData) => {
    setMarks((prev) =>
      prev.map((mark) => (mark.id === id ? { ...mark, ...markData } : mark))
    );
  };

  const addAttendance = (attendanceData) => {
    const newAttendance = {
      ...attendanceData,
      id: Date.now().toString(),
    };
    setAttendance((prev) => [...prev, newAttendance]);
  };

  const addFee = (feeData) => {
    const newFee = {
      ...feeData,
      id: Date.now().toString(),
    };
    setFees((prev) => [...prev, newFee]);
  };

  const updateFee = (id, feeData) => {
    setFees((prev) =>
      prev.map((fee) => (fee.id === id ? { ...fee, ...feeData } : fee))
    );
  };

  const getBatchesByClass = (classId) => {
    return batches.filter((batch) => batch.classId === classId);
  };

  const getStudentsByClassAndBatch = (classId, batchId) => {
    return students.filter(
      (student) => student.classId === classId && student.batchId === batchId
    );
  };

  const getTeachersByClass = (classId) => {
    return teachers.filter((teacher) =>
      teacher.assignedClasses.includes(classId)
    );
  };

  return (
    <DataContext.Provider
      value={{
        classes,
        batches,
        students,
        teachers,
        exams,
        marks,
        attendance,
        fees,
        addClass,
        addBatch,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addExam,
        updateExam,
        deleteExam,
        addMark,
        updateMark,
        addAttendance,
        addFee,
        updateFee,
        getBatchesByClass,
        getStudentsByClassAndBatch,
        getTeachersByClass,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
