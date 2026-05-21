require("dotenv").config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { appLog } = require("./logger");
const db = require("./config/mongooseConnection");

const adminRouter = require("./router/adminRouter");
const teacherRouter = require("./router/teacherRouter");
const studentRouter = require("./router/studentRouter");
const classRouter = require("./router/classRouter");
const batchRouter = require("./router/batchRouter");

const app = express();
const port = process.env.PORT || 300;


app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running...",
    timestamp: new Date().toISOString(),
  });
});

app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use("/class", classRouter);
app.use("/batch", batchRouter);

// Root route — placed AFTER all other routes so it doesn't shadow them
app.get("/", (req, res) => {
  res.send("Welcome to SMP Backend");
});

app.listen(port, () => {
  appLog(`Server is running at http://localhost:${port}`);
});
