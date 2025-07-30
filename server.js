const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema and model for tasks
const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks.map(task => ({ id: task._id, text: task.text, completed: task.completed })));
});

app.post('/tasks', async (req, res) => {
    const { text, completed } = req.body;
    const task = new Task({ text, completed });
    await task.save();
    res.json({ id: task._id, text: task.text, completed: task.completed });
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.patch('/tasks/:id', async (req, res) => {
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { completed }, { new: true });
    res.json({ id: task._id, text: task.text, completed: task.completed });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
