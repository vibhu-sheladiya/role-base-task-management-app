const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const scretKey = "csvscvsvsuwdvdfyd";
const moment = require("moment");

const register = async (req, res) => {
  try {
    const { email, name, password, role, confirmpass, } = req.body;
    if (!email || !name || !password || !role || !confirmpass ) {
      throw new Error("please all feild required and fillup");
    }
    if (password !== confirmpass) {
      throw new Error("password does not match");
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("user already existing this email");
    }
    const hashpassword = await bcrypt.hash(password, 8);
  

    const payload = {
      email,
      exp: moment().add(1, "days").unix(),
    };
    const token =await jwt.sign(payload, scretKey);
    const filter = {
      email,
      name,
      password: hashpassword,
      role,
      token,
   
    };
    const data = await User.create(filter);
    return res.status(200).json({ data: data, message: "created done" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }

    const comparepasword =await bcrypt.compare(password, user.password);
    if (!comparepasword) {
      throw new Error("invalid password");
    }
    const payload = {
      email: user.email,
      role: user.role,
    };
    const token = await jwt.sign(payload, scretKey, {
      expiresIn: "10m",
    });
    user.token = token;
    const output = await user.save();
    res.status(200).json({
      data: output,
      message: "login is done",
      success: true,
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const existinguser = await User.findById(userId);
    if (!existinguser) {
      throw new Error("user does not exists");
    }
    await User.findByIdAndUpdate(userId, req.body);
    res
      .status(201)
      .json({ data: existinguser, message: "updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const fetchList = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId); // Assuming you have middleware to extract userId from the request

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (currentUser.role === "1") {
      const allUsers = await User.find();
      res.status(200).json({ data: allUsers, message: "All users retrieved" });
    } else {
      res
        .status(200)
        .json({ data: currentUser, message: "Your details retrieved" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userId, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ data: deletedUser, message: "Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = {
  register,
  fetchList,
  login,
 
  updateUser,
  deleteUser,
 
};