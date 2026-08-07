import tasks, { getNextId } from '../data/tasks.js';

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Input Validation: Check if title is present
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Task title is required',
      });
    }

    // Create new task object
    const newTask = {
      id: getNextId(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
    };

    // Store in data array
    tasks.push(newTask);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Public
 */
export const getAllTasks = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
export const getTaskById = async (req, res) => {
  try {
    const paramId = req.params.id;

    // Find task by matching string representation of ID
    const task = tasks.find((t) => String(t.id) === String(paramId));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc    Update task by ID
 * @route   PUT /api/tasks/:id or PATCH /api/tasks/:id
 * @access  Public
 */
export const updateTask = async (req, res) => {
  try {
    const paramId = req.params.id;

    // Find task index
    const taskIndex = tasks.findIndex((t) => String(t.id) === String(paramId));

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, status } = req.body;

    // Check if at least one field is provided for update
    if (title === undefined && description === undefined && status === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field (title, description, or status) to update',
      });
    }

    // Update existing fields selectively
    if (title !== undefined && title.trim() !== '') {
      tasks[taskIndex].title = title.trim();
    }
    if (description !== undefined) {
      tasks[taskIndex].description = description.trim();
    }
    if (status !== undefined) {
      tasks[taskIndex].status = status;
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: tasks[taskIndex],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc    Delete task by ID
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
export const deleteTask = async (req, res) => {
  try {
    const paramId = req.params.id;

    // Find task index
    const taskIndex = tasks.findIndex((t) => String(t.id) === String(paramId));

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Remove task from array
    tasks.splice(taskIndex, 1);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
