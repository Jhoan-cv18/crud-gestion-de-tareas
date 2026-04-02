const express = require('express');
const router = express.Router();
const taskModel = require('../models/task');
const {
  validateTaskInput,
  validateTaskId,
  validateSearchParams
} = require('../middleware/validation');

// obtener tareas (con búsqueda y filtrado)
router.get('/', validateSearchParams, (req, res) => {
  try {
    const { search, status } = req.query;

    let tasks;
    if (search || status) {
      tasks = taskModel.searchTasks(search || '', status || '');
    } else {
      tasks = taskModel.getAllTasks();
    }

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
});

// obtener tarea por ID
router.get('/:id', validateTaskId, (req, res) => {
  try {
    const { id } = req.params;
    const task = taskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
});

// crear nueva tarea
router.post('/', validateTaskInput, (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'pending'
    };

    const result = taskModel.createTask(taskData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: result.task
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
});

// actualizar tarea
router.put('/:id', validateTaskId, validateTaskInput, (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      updates.description = req.body.description;
    }
    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo a actualizar'
      });
    }

    const result = taskModel.updateTask(id, updates);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error
      });
    }

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: result.task
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
});

// eliminar tarea
router.delete('/:id', validateTaskId, (req, res) => {
  try {
    const { id } = req.params;
    const result = taskModel.deleteTask(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
});

module.exports = router;
