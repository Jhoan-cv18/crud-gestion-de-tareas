const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

// crear directorio de datos si no existe
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// cargar tareas del archivo
function loadTasks() {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(DATA_FILE)) {
      saveTasks([]);
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error al guardar tareas:', error);
    throw error;
  }
}

function generateId(tasks) {
  if (tasks.length === 0) return '1';
  const maxId = Math.max(...tasks.map(t => parseInt(t.id, 10)));
  return String(maxId + 1);
}

function getCurrentDate() {
  return new Date().toISOString();
}

// validar estructura de tarea
function validateTask(task) {
  const errors = [];

  if (!task.title || typeof task.title !== 'string') {
    errors.push('El título es requerido y debe ser una cadena de texto');
  }

  if (task.title && task.title.trim().length === 0) {
    errors.push('El título no puede estar vacío');
  }

  if (task.title && task.title.length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }

  if (task.description && typeof task.description !== 'string') {
    errors.push('La descripción debe ser una cadena de texto');
  }

  if (task.description && task.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }

  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (task.status && !validStatuses.includes(task.status)) {
    errors.push(`El estado debe ser uno de: ${validStatuses.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function getAllTasks() {
  return loadTasks();
}

function getTaskById(id) {
  const tasks = loadTasks();
  return tasks.find(task => task.id === String(id)) || null;
}

function searchTasks(search = '', status = '') {
  let tasks = loadTasks();

  if (search) {
    const searchLower = search.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }

  if (status && status.trim() !== '') {
    tasks = tasks.filter(task => task.status === status);
  }

  return tasks;
}

function createTask(taskData) {
  const validation = validateTask(taskData);
  if (!validation.isValid) {
    return {
      success: false,
      task: null,
      error: validation.errors.join('; ')
    };
  }

  const tasks = loadTasks();
  const newTask = {
    id: generateId(tasks),
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    status: taskData.status || 'pending',
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  return {
    success: true,
    task: newTask,
    error: null
  };
}

function updateTask(id, updates) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === String(id));

  if (taskIndex === -1) {
    return {
      success: false,
      task: null,
      error: `Tarea con ID ${id} no encontrada`
    };
  }

  const existingTask = tasks[taskIndex];
  const updatedTask = {
    ...existingTask,
    ...updates,
    id: existingTask.id,
    createdAt: existingTask.createdAt,
    updatedAt: getCurrentDate()
  };

  const validation = validateTask(updatedTask);
  if (!validation.isValid) {
    return {
      success: false,
      task: null,
      error: validation.errors.join('; ')
    };
  }

  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);

  return {
    success: true,
    task: updatedTask,
    error: null
  };
}

function deleteTask(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === String(id));

  if (taskIndex === -1) {
    return {
      success: false,
      message: `Tarea con ID ${id} no encontrada`
    };
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  return {
    success: true,
    message: `Tarea con ID ${id} eliminada correctamente`
  };
}

module.exports = {
  getAllTasks,
  getTaskById,
  searchTasks,
  createTask,
  updateTask,
  deleteTask,
  validateTask
};
