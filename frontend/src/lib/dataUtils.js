/**
 * Data Utilities - Helper functions for data processing and calculations
 * Used across multiple components for statistics and data manipulation
 */

/**
 * Get dues count and amount for a student
 * Filters fees object to find "due" months and calculates total
 * @param {Object} fees - Monthly fees object with status values
 * @returns {Object} Object with dueCount and dueAmount
 */
export const getStudentDuesInfo = (fees) => {
  const dueMonths = Object.entries(fees).filter(
    ([_, status]) => status === "due"
  );
  return {
    dueCount: dueMonths.length,
    dueAmount: dueMonths.length * 1500, // Assuming monthly fee is 1500
  };
};

/**
 * Filter students by class ID
 * @param {Array} students - Array of student objects
 * @param {string} classId - Class ID to filter by
 * @returns {Array} Filtered array of students
 */
export const getStudentsInClass = (students, classId) => {
  return students.filter((student) => student.classId === classId);
};

/**
 * Filter students by batch ID
 * @param {Array} students - Array of student objects
 * @param {string} batchId - Batch ID to filter by
 * @returns {Array} Filtered array of students
 */
export const getStudentsInBatch = (students, batchId) => {
  return students.filter((student) => student.batchId === batchId);
};

/**
 * Get batches for a specific class
 * @param {Array} batches - Batch IDs array from class
 * @param {string} classId - Class ID
 * @param {Array} allBatches - All available batches
 * @returns {Array} Batches belonging to this class
 */
export const getBatchesInClass = (batches, classId, allBatches) => {
  const classBatchIds = batches || [];
  return allBatches.filter((batch) => classBatchIds.includes(batch.id));
};

/**
 * Calculate total dues for all students in a batch
 * @param {Array} students - All students
 * @param {string} batchId - Batch ID
 * @returns {number} Total dues amount
 */
export const calculateBatchDues = (students, batchId) => {
  const batchStudents = getStudentsInBatch(students, batchId);
  return batchStudents.reduce((total, student) => {
    const { dueAmount } = getStudentDuesInfo(student.fees);
    return total + dueAmount;
  }, 0);
};

/**
 * Calculate total dues for all students in a class
 * @param {Array} students - All students
 * @param {string} classId - Class ID
 * @returns {number} Total dues amount
 */
export const calculateClassDues = (students, classId) => {
  const classStudents = getStudentsInClass(students, classId);
  return classStudents.reduce((total, student) => {
    const { dueAmount } = getStudentDuesInfo(student.fees);
    return total + dueAmount;
  }, 0);
};

/**
 * Get all classes and batches for a teacher
 * @param {string} teacherId - Teacher ID
 * @param {Array} classes - All classes
 * @param {Array} batches - All batches
 * @returns {Object} Teacher's classes and batches
 */
export const getTeacherClassesAndBatches = (teacherId, classes, batches) => {
  return {
    classes,
    batches,
  };
};

/**
 * Calculate comprehensive statistics for a teacher
 * Computes total classes, batches, students, and dues
 * @param {Object} teacher - Teacher object with classes and feeData
 * @returns {Object} Statistics object with totals
 */
export const calculateTeacherStats = (teacher) => {
  if (!teacher || !teacher.classes) {
    return {
      totalClasses: 0,
      totalBatches: 0,
      totalStudents: 0,
      totalDues: 0,
    };
  }

  const totalClasses = teacher.classes.length;
  const totalBatches = teacher.classes.reduce(
    (count, cls) => count + (cls.batches ? cls.batches.length : 0),
    0
  );
  const totalStudents = teacher.classes.reduce((count, cls) => {
    return (
      count +
      cls.batches.reduce(
        (batchCount, batch) => batchCount + (batch.studentCount || 0),
        0
      )
    );
  }, 0);

  // Calculate total dues from teacher's fee data
  let totalDues = 0;
  if (teacher.feeData) {
    for (const className in teacher.feeData) {
      const classBatches = teacher.feeData[className];
      for (const batchName in classBatches) {
        totalDues += classBatches[batchName].totalDue || 0;
      }
    }
  }

  return {
    totalClasses,
    totalBatches,
    totalStudents,
    totalDues,
  };
};

/**
 * Calculate fees statistics for a student
 * Determines paid, unpaid months and amounts
 * @param {Object} fees - Monthly fees object with status values
 * @returns {Object} Statistics including paid/due months and amounts
 */
export const calculateStudentFeesStats = (fees) => {
  const months = Object.keys(fees);
  const paidMonths = months.filter((month) => fees[month] === "paid");
  const dueMonths = months.filter((month) => fees[month] === "unpaid");
  const monthlyFee = 300; // Fixed monthly fee amount

  return {
    paidMonths, // Array of paid month names
    dueMonths, // Array of unpaid month names
    totalPaid: paidMonths.length * monthlyFee,
    totalDue: dueMonths.length * monthlyFee,
    monthlyFee,
  };
};
