const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: "3d" } // Tokens expire after 7 days
  );
};

module.exports = generateToken;
