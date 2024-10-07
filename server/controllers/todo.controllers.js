const Todo = require('../models/todo.schema');
const mongoose = require('mongoose')

const createTodo = async (req, res) => {
    try {
        const { task } = req.body;
        const newTodo = new Todo({
            task
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllTodos = async (_, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const todayTasks = async (req, res) => {
    try {
        let { status } = req.params;
        if (status === 'pending') status = false;
        else if (status === 'completed') status = true;
        else return res.status(400).json({ error: 'Invalid status parameter. Use "pending" or "completed".' });
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        const tasks = await Todo.aggregate([
            {
                $match: {
                    completed: status,
                    createdAt: {
                        $gte: startOfToday,
                        $lte: endOfToday
                    }
                }
            }
        ]);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editTodo = async (req, res) => {
    try {
        let { id, task, completed } = req.body;
        id = new mongoose.Types.ObjectId(id);
        const updateData = {};
        if (task !== undefined) {
            updateData.task = task;
        }
        if (completed !== undefined) {
            updateData.completed = completed;
        }
        const updatedDoc = await Todo.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedDoc) {
            res.status(200).json({ message: 'Edit successful', updatedDoc });
        } else {
            res.status(404).json({ message: 'No document found with this ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        let { ids } = req.body;
        ids.forEach((elem, index) => {
            ids[index] = new mongoose.Types.ObjectId(elem)
        });
        let y = await Todo.deleteMany({ _id: { $in: ids } })
        if (y) return res.status(200).json({ message: "deletion successfull" })
        // let { id } = req.body;
        // id = new mongoose.Types.ObjectId(id)
        // let x = await Todo.findByIdAndDelete(id);
        // if (x) return res.status(200).json({ message: "deletion successfull" })
        else res.status(404).json({ message: "document not found" })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

module.exports = {
    createTodo,
    getAllTodos,
    todayTasks,
    editTodo,
    deleteTodo
};
