const express = require('express'); // Import the express module for handling HTTP requests

// Import controller functions from usercontroller and task.controller files
const {
  register, // Function to handle user registration
  login, // Function to handle user login
  updateUser, // Function to update user details
  fetchList, // Function to fetch a list of users
  updateUserDetailsByAdmin, // Function for admins to update user details
  createTaskAdmin, // Function to allow admin to create tasks
  deleteUser, // Function to delete a user
  viewAllUsers, // Function for viewing all users
  updateRoleByAdmin, // Function for admins to update user roles
  deleteTaskByAdmin, // Function for admins to delete tasks
  getUserTasks // Function to get tasks of a specific user
} = require('../../controllers/usercontroller');

const { userAuth } = require('../../middleware/auth'); // Middleware for user authentication

// Import task-related controller functions from task.controller file
const {
  createTask, // Function to create a task
  markTaskAsCompleted, // Function to mark a task as completed
  getUserTasksByCategory, // Function to get tasks by category
  deleteTask, // Function to delete a task
  updateTaskForUser, // Function to update a task for a user
  deleteTaskForUser // Function to delete a task for a user
} = require('../../controllers/task.controller');

const router = express.Router();  // Create a new router instance to handle routing

// Define task-related routes

// POST route to create a task
router.post('/create-task', createTask);  

// POST route for admin to create a task
router.post('/create-task-admin', createTaskAdmin);

// PUT route to mark a task as completed
router.put('/markscomplted-update', markTaskAsCompleted);

// GET route to view all users (admin management route)
router.get('/mange-all-task-update',userAuth(), viewAllUsers);

// PUT route for admin to update a user's role
router.put('/mange-role-task-update', updateRoleByAdmin);

// PUT route for admin to update user details
router.put('/mange-task-update', updateUserDetailsByAdmin);

// GET route to retrieve tasks for a specific user
router.get('/tasks',userAuth(), getUserTasks);

// GET route to retrieve tasks by category for a specific user
router.get('/tasks/:category', getUserTasksByCategory);

// DELETE route to delete a task by its ID
router.delete('/tasks/:id', deleteTask);

// Define user-related routes

// POST route to register a new user
router.post('/create', register);

// POST route to login a user (with user authentication middleware)
router.post('/login', userAuth(), login);

// PUT route to update user details
router.put('/update', updateUser);

// GET route to fetch a list of users (with user authentication middleware)
router.get('/list', userAuth(), fetchList);

// DELETE route to delete a user
router.delete('/delete', deleteUser);

// DELETE route for admin to delete a task
router.delete('/delete-admin', deleteTaskByAdmin);

// PATCH route to update a task for a user by its ID
router.patch('/all/tasks/:id', updateTaskForUser);

// DELETE route to delete a task for a user by its ID
router.delete('/all/tasks/:id', deleteTaskForUser);

// Export the router to be used in other parts of the application
module.exports = router;
