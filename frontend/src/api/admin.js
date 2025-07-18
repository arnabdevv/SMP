// src/api/admin.js
import axios from "./axios";

export const fetchAdminDashboard = async () => {
  const response = await axios.get("/admin/dashboard");
  return response.data;
};

export const adminLogout = async () => {
  await axios.get("/admin/logout");
};
