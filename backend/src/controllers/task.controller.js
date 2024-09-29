// Import User and Task models
const User = require("../models/user.model");
const Task = require("../models/task.model");

// Controller function to create a new task
const createTask = async (req, res) => {
    try {
        // Destructure userId, desc, and category from the request body
        const { userId, desc, category } = req.body;

        // Check if userId, desc, and category are provided
        if (!userId || !desc || !category) {
            return res.status(400).send({ message: "User ID, description, and category are required" });
        }

        // Find the user by the provided userId
        const user = await User.findById(userId);

        // If user not found, return a 404 error
        if (!user) {
            return res.status(404).send({ message: `No user found with ID ${userId}` });
        }

        // Create a new task with user association
        const newTask = await Task.create({ userId, desc, category });

        // Return success response with the newly created task
        res.status(200).json({ data: newTask, message: 'Task created successfully' });
    } catch (error) {
        // Return a 500 error if something goes wrong
        res.status(500).json({ message: `Error creating task: ${error.message}` });
    }
};

// Controller function to mark a task as completed
const markTaskAsCompleted = async (req, res) => {
    const { id } = req.body; // Destructure task ID from the request body
    
    try {
        // Find the task by its ID and mark it as completed
        const task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
        
        // If task not found, return a 404 error
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        
        // Return success response with the updated task
        res.json({ msg: 'Task marked as completed', task });
    } catch (err) {
        // Log the error and return a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Controller function to get tasks of a specific user by category
const getUserTasksByCategory = async (req, res) => {
    const { category } = req.params; // Destructure category from the request parameters
    
    try {
        // Find tasks of the logged-in user by category
        const tasks = await Task.find({ userId: req.user.id, category });
        
        // If no tasks found, return a 404 error
        if (!tasks) {
            return res.status(404).json({ msg: 'No tasks found' });
        }
        
        // Return success response with the tasks
        res.json({ msg: 'Tasks retrieved successfully', tasks });
    } catch (err) {
        // Log the error and return a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Controller function to delete a task by ID
const deleteTask = async (req, res) => {
    const { id } = req.params; // Destructure task ID from the request parameters
    console.log(id); // Log the task ID for debugging

    try {
        // Delete the task by ID
        const result = await Task.deleteOne({ _id: id });

        // If no task was deleted, return a 404 error
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Return success response after deletion
        res.json({ msg: 'Task deleted successfully' });
    } catch (err) {
        // Log the error and return a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Controller function to update a task's description and category for a user
const updateTaskForUser = async (req, res) => {
    const { id } = req.params; // Destructure task ID from the request parameters
    const { description, category } = req.body; // Destructure description and category from the request body
    
    try {
        // Find the task by ID and update its description and category
        const task = await Task.findByIdAndUpdate(id, { description, category }, { new: true });
        
        // If task not found, return a 404 error
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Return success response with the updated task
        res.json({ msg: 'Task updated successfully', task });
    } catch (err) {
        // Handle validation errors specifically
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Invalid request', errors: err.errors });
        }

        // Log the error and return a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Controller function to delete a task for a user by ID
const deleteTaskForUser = async (req, res) => {
    const { id } = req.params; // Destructure task ID from the request parameters
    
    try {
        // Find the task by ID and remove it
        await Task.findByIdAndRemove(id);
        
        // Return success response after deletion
        res.json({ msg: 'Task deleted successfully' });
    } catch (err) {
        // Log the error and return a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Export all controller functions
module.exports = {
    createTask,
    markTaskAsCompleted,
    getUserTasksByCategory,
    deleteTask,
    updateTaskForUser,
    deleteTaskForUser
}
