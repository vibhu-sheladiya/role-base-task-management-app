const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const scretKey = "csvscvsvsuwdvdfyd";
const moment = require("moment");
// const Adress = require("../model/adress.model");

const register = async (req, res) => {
  try {
    const { email, name, password, role, confirmpass, } = req.body;
    // if (!email || !name || !password || !role || !confirmpass || ) {
    //   throw new Error("please all feild required and fillup");
    // }
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

// const updateUser = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const existinguser = await User.findById(userId);
//     if (!existinguser) {
//       throw new Error("user does not exists");
//     }
//     await User.findByIdAndUpdate(userId, req.body);
//     res
//       .status(201)
//       .json({ data: existinguser, message: "updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const fetchList = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.body.userId); // Assuming you have middleware to extract userId from the request

//     if (!currentUser) {
//       throw new Error("User not found");
//     }

//     if (currentUser.role === "1") {
//       const allUsers = await User.find();
//       res.status(200).json({ data: allUsers, message: "All users retrieved" });
//     } else {
//       res
//         .status(200)
//         .json({ data: currentUser, message: "Your details retrieved" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const fetchListAllSearchPage = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.body.userId); // Assuming you have middleware to extract userId from the request

//     if (!currentUser) {
//       throw new Error("User not found");
//     }

//     let query = {};
//     let message = "";

//     if (currentUser.role === "1") {
//       // Check if the user is an admin
//       // If the user is an admin, fetch all users
//       query = {}; // Empty query to retrieve all users
//       message = "All users retrieved";
//     } else {
//       // If the user is not an admin, fetch only their own details
//       query = { _id: currentUser._id }; // Query to retrieve only the current user's details
//       message = "Your details retrieved";
//     }

//     // Implement pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const users = await User.find(query)
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({ data: users, message: message });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const existingUser = await User.findById(userId);

//     if (!existingUser) {
//       throw new Error("User not found");
//     }

//     const deletedUser = await User.findByIdAndDelete(userId, req.body, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ data: deletedUser, message: "Deleted Successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const searchApi = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       throw new Error("Query parameter is missing");
//     }
//     const regex = new RegExp(query, "i");
//     const users = await User.find({
//       $or: [{ name: regex }, { email: regex }],
//     });

//     res.status(200).json({ data: users, message: "Search results" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const pagination = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 2;

//     const totalCount = await User.countDocuments();

//     const totalPages = Math.ceil(totalCount / limit);

//     const skip = (page - 1) * limit;

//     const users = await User.find().skip(skip).limit(limit);
//     if (!users || users.length === 0) {
//       throw new Error("No user found");
//     }

//     res.status(200).json({
//       paginations: {
//         total: totalCount,
//         totalPages: totalPages,
//         currentPages: page,
//         limit: limit,
//         message: "Pagination results",
//       },
//       users: users,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const purchase = async (req, res) => {
//   const purchaseId = req.body.id;

//   // Assuming you have a way to identify the user, such as user ID stored in session or JWT token
//   const userId = req.user.id; // Replace with your actual way of getting the user ID

//   const previousPurchase = await Purchase.findOne({ userId });

//   if (previousPurchase) {
//       return res.status(400).json({ message: "You have already made a purchase" });
//   }

//   // Proceed with the purchase since the user has not made a purchase before
//   // Here you can write code to actually process the purchase
// };


// const deleteManyUsers = async (req, res) => {
//   try {
//     const { _id } = req.body;
//     const result = await User.deleteMany({ _id: { $in: _id } });
//     if (result.deletedCount === 0) {
//       throw new Error("No users deleted");
//     }
//     return res.status(200).send({
//       success: true,
//       message: "Deleted Successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({
//       success: false,
//       message: `${err}`,
//     });
//   }
// };

module.exports = {
  register,
  // fetchList,
  login,
  // deleteManyUsers,
  // updateUser,
  // deleteUser,
  // searchApi,
  // pagination,
  // purchase
  // fetchListAllSearchPage
};