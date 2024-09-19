const express = require('express'); // Import express module
const {
  register,
  login,
  updateUser,
  fetchList,updateUserDetailsByAdmin,createTaskAdmin,
  deleteUser,viewAllUsers,updateRoleByAdmin,deleteTaskByAdmin
} = require('../../controllers/usercontroller');
const { userAuth } = require('../../middleware/auth');

const {createTask,markTaskAsCompleted}=require('../../controllers/task.controller')

// // Export a function that takes 'io' and returns a configured router
// module.exports = (io) => {
//   const taskController = require('../../controllers/task.controller')(io);

  const router = express.Router();  // Create a new router instance

  // Define your routes
  router.post('/create-task', createTask);  // Create a task route
  router.post('/create-task-admin', createTaskAdmin);  // Create a task route
  
  // router.put('/updateTask', taskController.updateTask);   // Update task route
  router.put('/markscomplted-update', markTaskAsCompleted);  // Create a task route
  router.get('/mange-all-task-update', viewAllUsers);  // Create a task route
  router.put('/mange-role-task-update', updateRoleByAdmin);  // Create a task route
  router.put('/mange-task-update', updateUserDetailsByAdmin);  // Create a task route


  router.post('/create', register);
  router.post('/login', userAuth(), login);
  router.put('/update', updateUser);
  router.get('/list', userAuth(), fetchList);
  router.delete('/delete', deleteUser);
  router.delete('/delete-admin', deleteTaskByAdmin);



  module.exports = router;


