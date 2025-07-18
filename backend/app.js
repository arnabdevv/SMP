const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const debug = require("debug")("development:app");
// MongoDB connection
const db = require("./config/mongooseConnection");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const adminRouter = require("./router/adminRouter");
const teacherRouter = require("./router/teacherRouter");
const studentRouter = require("./router/studentRouter");
const classRouter = require("./router/classRouter");
const batchRouter = require("./router/batchRouter");

const app = express();

// Use cors middleware - allows requests from http://localhost:5173

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Alternatively, to allow any origin (use with caution in production):
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use("/class", classRouter);
app.use("/batch", batchRouter);

app.listen(3000, () => {
  debug("Backend Running...");
});
