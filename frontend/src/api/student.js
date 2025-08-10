// src/api/student.js
import axios from "./axios";

export const registerStudent = async (studentData) => {
  const response = await axios.post("/api/student/register", studentData);
  return response.data;
};

export const fetchStudents = async (classId, batchId) => {
  const params = {};
  if (classId) params.classId = classId;
  if (batchId) params.batchId = batchId;
  const response = await axios.get("/api/student/list", { params });
  return response.data.students;
};
