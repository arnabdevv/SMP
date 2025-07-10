const express = require("express");
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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

app.listen(3000, () => {
  debug("Backend Running...");
});
