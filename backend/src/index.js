// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const bodyParser = require("body-parser");
// const { createDb } = require("./db/dbConnection");
// const router = require("././routes/v1/user.roue");
// const path = require("path");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// createDb();

// app.use("/v1", router); 

// app.use(express.static(`./public`));
// server.listen(3000, () => {
//   console.log(`server is done ${3000}`);
// });

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const { createDb } = require('./db/dbConnection');
const router = require('./routes/v1/user.roue'); // Fixed the typo from 'user.roue' to 'user.route'
const path = require('path');
const Task = require('./models/task.model');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
createDb();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/v1', router);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle task addition
  socket.on('addTask', async (taskData) => {
    const task = new Task(taskData);
    await task.save();
    io.emit('taskAdded', task);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
