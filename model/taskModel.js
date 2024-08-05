import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "queued", "completed"],
        default: "pending",
    },
    dueDate: {
        type: Date,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    
})

const Task = mongoose.model("Task", taskSchema);

export default Task;