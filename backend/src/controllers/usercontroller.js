const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const scretKey = "csvscvsvsuwdvdfyd";
const moment = require("moment");
const Task = require("../models/task.model");

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


const viewAllUsers = async (req, res) => {
  try {
    const { userid } = req.body;
    const { role } = req.body; // Assuming user information is attached to the request (e.g., via middleware)

    // Check if the logged-in user is an admin
    if (role !== '2') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Find tasks assigned to the user
    const tasks = await Task.find({ assignedTo: userid });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user.' });
    }

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateRoleByAdmin = async (req, res) => {
  try {
    const { adminid, userid, role } = req.body;

    // Check if the logged-in user is an admin
    const adminUser = await User.findById(adminid);
    if (!adminUser || adminUser.role !== '2') { // Assuming role is stored as a string 'admin'
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Check if the admin is trying to change their own role
    if (adminid === userid) {
      return res.status(400).json({ message: 'Admins cannot change their own role.' });
    }

    // Validate the new role
    const validRoles = ['1', '2']; // Example roles
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { role },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUserDetailsByAdmin = async (req, res) => {
  try {
    const { adminid, desc, category, taskid } = req.body;

    // Check if the logged-in user is an admin
    const adminUser = await User.findById(adminid);
    if (!adminUser || adminUser.role !== '2') { // Assuming role is stored as a string 'admin'
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Validate fields
    if ( !desc || !category || !taskid) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find and update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskid,
      { assignedTo: desc, category },
      // { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task updated successfully.', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createTaskAdmin = async (req, res) => {
  try {
    const { adminid, userId, desc, category, taskid } = req.body;

    // Check if the admin is valid and has the right role
    const adminUser = await User.findById(adminid);
    if (!adminUser || adminUser.role !== '2') { // Assuming role is stored as a string 'admin'
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create the new task
    const newTask = new Task({
      taskid,      // Assuming `taskid` is unique identifier
      desc,
      category,
      assignedTo: userId
    });

    await newTask.save();

    res.status(201).json({ message: 'Task created successfully.', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteTaskByAdmin = async (req, res) => {
  try {
    const { adminid, taskid } = req.body;

    // Check if the logged-in user is an admin
    const adminUser = await User.findById(adminid);
    if (!adminUser || adminUser.role !== '2') { // Assuming role '2' represents admin
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Validate that taskid is provided
    if (!taskid) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find and delete the task
    const deletedTask = await Task.findByIdAndDelete(taskid);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.', task: deletedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    
    if (!tasks) {
      return res.status(404).json({ msg: 'No tasks found' });
    }
    
    res.json({ msg: 'Tasks retrieved successfully', tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  register,
  fetchList,
  login,
  viewAllUsers,createTaskAdmin,deleteTaskByAdmin,getUserTasks,
  updateUser,
  deleteUser,updateRoleByAdmin,updateUserDetailsByAdmin
 
};

