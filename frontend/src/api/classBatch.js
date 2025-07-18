// src/api/classBatch.js
import axios from "./axios";

export const fetchClasses = async () => {
  const response = await axios.get("/class/all");
  return response.data;
};

export const createClass = async (className) => {
  const response = await axios.post("/class/create", { className });
  return response.data;
};

export const fetchBatches = async (classId) => {
  const response = await axios.get(`/batch/all?classId=${classId}`);
  return response.data;
};

export const createBatch = async (batchName, classId) => {
  const response = await axios.post("/batch/create", { batchName, classId });
  return response.data;
};
