// Helper function to get dues count and amount for a student
export const getStudentDuesInfo = (fees) => {
  const dueMonths = Object.entries(fees).filter(
    ([_, status]) => status === "due"
  );
  return {
    dueCount: dueMonths.length,
    dueAmount: dueMonths.length * 1500, // Assuming monthly fee is 1500
  };
};

// Helper function to get students in a class
export const getStudentsInClass = (students, classId) => {
  return students.filter((student) => student.classId === classId);
};

// Helper function to get students in a batch
export const getStudentsInBatch = (students, batchId) => {
  return students.filter((student) => student.batchId === batchId);
};

// Helper function to get batches in a class
export const getBatchesInClass = (batches, classId, allBatches) => {
  const classBatchIds = batches || [];
  return allBatches.filter((batch) => classBatchIds.includes(batch.id));
};

// Helper function to calculate total dues for a batch
export const calculateBatchDues = (students, batchId) => {
  const batchStudents = getStudentsInBatch(students, batchId);
  return batchStudents.reduce((total, student) => {
    const { dueAmount } = getStudentDuesInfo(student.fees);
    return total + dueAmount;
  }, 0);
};

// Helper function to calculate total dues for a class
export const calculateClassDues = (students, classId) => {
  const classStudents = getStudentsInClass(students, classId);
  return classStudents.reduce((total, student) => {
    const { dueAmount } = getStudentDuesInfo(student.fees);
    return total + dueAmount;
  }, 0);
};

// Helper function to get a teacher's classes and batches
export const getTeacherClassesAndBatches = (teacherId, classes, batches) => {
  // In this dummy data we don't have teacher-class mapping,
  // so returning all classes for demo
  return {
    classes,
    batches,
  };
};

// Helper function to calculate stats for a teacher
export const calculateTeacherStats = (teacher, classes, batches, students) => {
  const { classes: teacherClasses, batches: teacherBatches } =
    getTeacherClassesAndBatches(teacher.id, classes, batches);

  const totalStudents = students.length;
  const totalDues = classes.reduce((total, cls) => {
    return total + calculateClassDues(students, cls.id);
  }, 0);

  return {
    totalClasses: teacherClasses.length,
    totalBatches: teacherBatches.length,
    totalStudents,
    totalDues,
  };
};

// Helper function to calculate fees stats for a student
export const calculateStudentFeesStats = (fees) => {
  const months = Object.keys(fees);
  const paidMonths = months.filter((month) => fees[month] === "paid");
  const dueMonths = months.filter((month) => fees[month] === "due");
  const monthlyFee = 1500; // Assuming monthly fee is 1500

  return {
    paidMonths,
    dueMonths,
    totalPaid: paidMonths.length * monthlyFee,
    totalDue: dueMonths.length * monthlyFee,
    monthlyFee,
  };
};
