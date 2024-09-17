const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const scretKey = "csvscvsvsuwdvdfyd";

const userAuth = () => (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new Error("please authenticated");
    }
    const decoded = jwt.verify(token.replace("Bearer ", ""), scretKey);
    if (!decoded) {
      throw new Error("invalid token");
    }
    let user = User.findOne({ email: decoded.email });
    token = req.token;
    user = req.user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { userAuth };