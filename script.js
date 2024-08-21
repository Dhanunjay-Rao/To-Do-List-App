// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const alertContainer = document.getElementById('alert-container');
const editTaskModal = $('#editTaskModal');
const editTaskInput = document.getElementById('edit-task-input');
const editTaskForm = document.getElementById('edit-task-form');

let tasks = [];
let currentEditId = null;

// Load tasks from Local Storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    showAlert('Please enter a task description.', 'danger');
  } else {
    const task = {
      id: Date.now(),
      description: taskText,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    addTaskToList(task);
    taskForm.reset();
    showAlert('Task added successfully!', 'success');
  }
});

// Edit Task
editTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedText = editTaskInput.value.trim();
  if (updatedText === '') {
    showAlert('Task description cannot be empty.', 'danger');
  } else {
    tasks = tasks.map(task => {
      if (task.id === currentEditId) {
        return { ...task, description: updatedText };
      }
      return task;
    });
    saveTasks();
    updateTaskInDOM(currentEditId, updatedText);
    editTaskModal.modal('hide');
    showAlert('Task updated successfully!', 'success');
  }
});

// Load Tasks
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => addTaskToList(task));
  }
}

// Save Tasks to Local Storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add Task to DOM
function addTaskToList(task) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.setAttribute('data-id', task.id);

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.description;
  if (task.completed) {
    span.classList.add('completed');
  }

  const div = document.createElement('div');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input mr-2';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-sm btn-warning mx-1';
  editBtn.innerHTML = 'Edit';
  editBtn.addEventListener('click', () => openEditModal(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-sm btn-danger';
  deleteBtn.innerHTML = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  div.appendChild(checkbox);
  div.appendChild(editBtn);
  div.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(div);

  taskList.appendChild(li);
}

// Toggle Task Completion
function toggleTask(id, completed) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed };
    }
    return task;
  });
  saveTasks();
  const taskText = document.querySelector(`li[data-id='${id}'] .task-text`);
  if (completed) {
    taskText.classList.add('completed');
  } else {
    taskText.classList.remove('completed');
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  const taskItem = document.querySelector(`li[data-id='${id}']`);
  if (taskItem) {
    taskList.removeChild(taskItem);
  }
  showAlert('Task deleted successfully!', 'success');
}

// Open Edit Modal
function openEditModal(id) {
  currentEditId = id;
  const task = tasks.find(task => task.id === id);
  editTaskInput.value = task.description;
  editTaskModal.modal('show');
}

// Update Task in DOM
function updateTaskInDOM(id, updatedText) {
  const taskItem = document.querySelector(`li[data-id='${id}'] .task-text`);
  if (taskItem) {
    taskItem.textContent = updatedText;
  }
}

// Show Alert
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
  alert.role = 'alert';
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;
  alertContainer.appendChild(alert);
  setTimeout(() => {
    $(alert).alert('close');
  }, 3000);
}
