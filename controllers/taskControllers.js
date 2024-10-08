import Task from "../model/taskModel.js";
import CatchAsync from "../utils/CatchAsync.js";


// Create Task by only admin for specific user
export const createTask = CatchAsync(async (req, res, next) => {
    const { title, description, dueDate, status, assignedTo } = req.body;

    // console.log(req.body);


    await Task.create({
        title,
        description,
        status,
        assignedTo,
        dueDate
    });

    res.status(201).json({
        status: "success",
        message: "Task created successfully"

    })
})

// Get Task for Specific User
export const getTasks = CatchAsync(async (req, res, next) => {


    const tasks = await Task.find({ assignedTo: req.user._id });



    res.status(200).json({
        status: "success",
        data: {
            tasks
        }
    })

})

// Update Task by only admin for specific user
export const updateTask = CatchAsync(async (req, res, next) => {
    const { title, description, dueDate, status, assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, {
        title,
        description,
        status,
        dueDate,
        assignedTo
    }, { new: true, runValidators: true });

    res.status(200).json({
        status: "success",
        data: {
            task
        }
    })
})

// Delete Task by only admin for specific user
export const deleteTask = CatchAsync(async (req, res, next) => {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: "success",
        data: null
    })
})


// Get All Tasks for all users by admin
export const getAllTasks = CatchAsync(async (req, res, next) => {
    const tasks = await Task.find().populate({
        path: 'assignedTo',
        select: ['name', 'photo']
    });


    res.status(200).json({
        status: "success",
        data: {
            tasks
        }
    })
})