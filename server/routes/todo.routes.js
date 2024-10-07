const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controllers');

router.post('/todos', todoController.createTodo);
router.get('/todos', todoController.getAllTodos);
router.get('/daily/:status', todoController.todayTasks);
router.patch('/edit', todoController.editTodo)
router.delete('/deleteTodo', todoController.deleteTodo)
router.get('/')

module.exports = router;
