import { protect, restrictTo } from "../controllers/authController.js";
import { createTask, deleteTask, getAllTasks, getTasks, updateTask } from "../controllers/taskControllers.js";
import express from "express";


const router = express.Router();


// Get all users by admin
router.get("/getAllTasks", protect, restrictTo('admin') ,getAllTasks);

// Get Task For Only specific User
router.route('/')
.get( protect, getTasks)
// acessable by admin
.post(protect, restrictTo('admin'), createTask)
.patch(protect, restrictTo('admin'), updateTask)
.delete(protect, restrictTo('admin'), deleteTask);

export default router;