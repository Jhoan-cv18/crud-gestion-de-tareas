// validar campos de tarea
function validateTaskInput(req, res, next) {
  const { title, description, status } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El cuerpo de la solicitud no puede estar vacío'
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'El título debe ser una cadena de texto'
      });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede estar vacío'
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede exceder 100 caracteres'
      });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'La descripción debe ser una cadena de texto'
      });
    }

    if (description.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'La descripción no puede exceder 500 caracteres'
      });
    }
  }

  if (status !== undefined) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${validStatuses.join(', ')}`
      });
    }
  }

  next();
}

// validar ID de tarea
function validateTaskId(req, res, next) {
  const { id } = req.params;

  if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número entero positivo válido'
    });
  }

  next();
}

// validar parámetros de búsqueda
function validateSearchParams(req, res, next) {
  const { search, status } = req.query;

  if (search !== undefined) {
    if (typeof search !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'El parámetro search debe ser una cadena de texto'
      });
    }

    if (search.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'El término de búsqueda no puede exceder 200 caracteres'
      });
    }
  }

  if (status !== undefined) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status.trim() !== '' && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${validStatuses.join(', ')}`
      });
    }
  }

  next();
}

module.exports = {
  validateTaskInput,
  validateTaskId,
  validateSearchParams
};
