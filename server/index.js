const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todo.routes');
const app = express();

const PORT = 3000;

app.use(cors())
app.use(express.json());
app.use('/', todoRoutes);

mongoose.connect('mongodb://localhost:27017/todo-app')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (_, res) => {
    res.json({ message: 'boink' });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
