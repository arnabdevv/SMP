const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "You need to login first" });
    }
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { isAuthenticated };
