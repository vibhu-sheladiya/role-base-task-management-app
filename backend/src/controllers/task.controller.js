
const User = require("../models/user.model");

const Task= require("../models/task.model");

const createTask = async (req, res) => {
    try {
        // Destructure userId, desc, and category from req.body
        const { userId, desc, category } = req.body;

        // Check if userId, desc, and category are provided
        if (!userId || !desc || !category) {
            return res.status(400).send({ message: "User ID, description, and category are required" });
        }

        // Find the user by the provided userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: `No user found with ID ${userId}` });
        }

        // Create the task with user association
        const newTask = await Task.create({  userId, desc, category });

        // Return success response
        res.status(200).json({ data: newTask, message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error creating task: ${error.message}` });
    }
};

const markTaskAsCompleted  = async(req,res)=>{
  const { id } = req.body;
  
  try {
    const task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
    
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    res.json({ msg: 'Task marked as completed', task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}


module.exports = {
  createTask,markTaskAsCompleted
}

// const updateBlog = async (req, res) => {
//     try {
//       const { userId, blogId, title, desc } = req.body;
  
//       // Check if user exists
//       const userExists = await User.findById(userId);
//       if (!userExists) {
//         throw new Error("User not found!");
//       }
  
//       // Check if blog exists
//       const blogExists = await Blog.findById(blogId); // Corrected model
//       if (!blogExists) {
//         throw new Error("Blog not found!");
//       }
  
//       // Update blog
//       blogExists.title = title;
//       blogExists.desc = desc;
//       await blogExists.save();
  
//       res.status(200).json({
//         success: true,
//         message: "Blog updated successfully!",
//         data: blogExists,
//       });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };
  

//   const deleteblog = async (req, res) => {
//   try {
//     const blogId = req.body.blogId;
//     const existingUser = await Blog.findById(blogId);

//     if (!existingUser) {
//       throw new Error("Blog not found");
//     }

//     const deletedUser = await Blog.findByIdAndDelete(blogId, req.body, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ data: deletedUser, message: "Deleted Successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const getAllBlogs = async (req, res) => {
//   try {
//     // Fetch all blog posts sorted by 'createdAt' in descending order (-1)
//     const blogs = await Blog.find().sort({ createdAt: -1 });

//     // Respond with the sorted list of blog posts
//     res.status(200).json({
//       success: true,
//       message: "Fetched all blog posts successfully!",
//       data: blogs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getBlogById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;


//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user not found!",
//       });
//     }

//     // Fetch the blog post by its ID
//     const blog = await Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog post not found!",
//       });
//     }

//     // Respond with the full content of the blog post
//     res.status(200).json({
//       success: true,
//       message: "Blog post retrieved successfully!",
//       data: {
//         title: blog.title,
//         content: blog.desc,  // assuming 'desc' holds the full blog content
//         createdAt: blog.createdAt, // return the date the post was created
//         author: blog.author, // Optional: you can include author info if needed
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// module.exports = {
//     createTask,updateBlog,deleteblog,getAllBlogs,getBlogById
// };

// module.exports = (io) => {
//     const User = require("../models/user.model");
//     const Task = require("../models/task.model");
  
//     const createTask = async (req, res) => {
//       try {
//         const { userId, desc, category } = req.body;
  
//         if (!userId || !desc || !category) {
//           return res.status(400).send({ message: "User ID, description, and category are required" });
//         }
  
//         const user = await User.findById(userId);
  
//         if (!user) {
//           return res.status(404).send({ message: `No user found with ID ${userId}` });
//         }
  
//         const newTask = await Task.create({ user: userId, desc, category });
  
//         // Emit event to all clients when a new task is created
//         io.emit("newTaskCreated", newTask);
  
//         res.status(200).json({ data: newTask, message: 'Task created successfully' });
//       } catch (error) {
//         res.status(500).json({ message: `Error creating task: ${error.message}` });
//       }
//     };
  
//     return {
//       createTask
//     };
//   };


  
// module.exports = (io) => {
//     const User = require("../models/user.model");
//     const Task = require("../models/task.model");
  
//     // Function to create a task
//     const createTask = async (req, res) => {
//       try {
//         const { userId, desc, category } = req.body;
  
//         if (!userId || !desc || !category) {
//           return res.status(400).send({ message: "User ID, description, and category are required" });
//         }
  
//         const user = await User.findById(userId);
  
//         if (!user) {
//           return res.status(404).send({ message: `No user found with ID ${userId}` });
//         }
  
//         const newTask = await Task.create({ user: userId, desc, category });
  
//         // Emit the new task event to all connected clients
//         io.emit("newTaskCreated", newTask);
  
//         return res.status(200).json({ data: newTask, message: 'Task created successfully' });
//       } catch (error) {
//         return res.status(500).json({ message: `Error creating task: ${error.message}` });
//       }
//     };
  
//     // Example function to update a task (with socket emission for task updates)
//     const updateTask = async (req, res) => {
//       try {
//         const { taskId, status } = req.body;
  
//         const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
  
//         if (!updatedTask) {
//           return res.status(404).json({ message: "Task not found" });
//         }
  
//         // Emit the task status update event
//         io.emit("taskStatusUpdated", updatedTask);
  
//         return res.status(200).json({ data: updatedTask, message: "Task updated successfully" });
//       } catch (error) {
//         return res.status(500).json({ message: `Error updating task: ${error.message}` });
//       }
//     };
  
//     return {
//       createTask,
//       updateTask
//     };
//   };
  