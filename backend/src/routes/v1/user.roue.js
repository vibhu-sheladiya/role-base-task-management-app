const express = require('express'); // Import express module
const {
  register,
  login,
  updateUser,
  fetchList,
  deleteUser,
} = require('../../controllers/usercontroller');
const { userAuth } = require('../../middleware/auth');

// Export a function that takes 'io' and returns a configured router
module.exports = (io) => {
  const taskController = require('../../controllers/task.controller')(io);

  const router = express.Router();  // Create a new router instance

  // Define your routes
  router.post('/createTask', taskController.createTask);  // Create a task route
  router.put('/updateTask', taskController.updateTask);   // Update task route

  router.post('/create', register);
  router.post('/login', userAuth(), login);
  router.put('/update', updateUser);
  router.get('/list', userAuth(), fetchList);
  router.delete('/delete', deleteUser);

  return router;
};

