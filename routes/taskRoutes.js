import { protect, restrictTo } from "../controllers/authController.js";
import { createTask, deleteTask, getAllTasks, getTasks, updateTask } from "../controllers/taskControllers.js";
import express from "express";


const router = express.Router();


// Get all users by admin
router.get("/getAllTasks", protect, restrictTo('admin', 'projectManager') ,getAllTasks);

// Get Task For Only specific User
router.route('/:id')
.get( protect, getTasks)
// acessable by admin
.post(protect, restrictTo('admin', 'projectManager'), createTask)
.patch(protect, updateTask)
.delete(protect, restrictTo('admin'), deleteTask);

export default router;