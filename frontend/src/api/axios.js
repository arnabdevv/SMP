// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/", // or your deployed backend URL
  withCredentials: true, // if using cookies for auth
});

export default instance;
