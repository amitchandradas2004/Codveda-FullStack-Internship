import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Base route: /api/tasks

router.route('/')
  .post(createTask)
  .get(getAllTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
