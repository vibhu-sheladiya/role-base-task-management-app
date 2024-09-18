const socket = io();

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const task = document.getElementById('task').value;

  socket.emit('addTask', { description, task });

  document.getElementById('description').value = '';
  document.getElementById('task').value = '';
});

socket.on('taskAdded', (task) => {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');
  li.textContent = `${task.description}: ${task.task}`;
  taskList.appendChild(li);
});
