document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Fetch and display tasks from the backend
    const fetchTasks = async () => {
        const res = await fetch('http://localhost:3000/tasks');
        const tasks = await res.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;
        if (task.completed) {
            li.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.addEventListener('click', () => toggleTask(task.id, !task.completed));

        li.appendChild(deleteBtn);
        return li;
    };

    const addTask = async () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const res = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: taskText, completed: false }),
            });
            const newTask = await res.json();
            const li = createTaskElement(newTask);
            taskList.appendChild(li);
            taskInput.value = '';
        }
    };

    const deleteTask = async (id) => {
        await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    };

    const toggleTask = async (id, completed) => {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }),
        });
        fetchTasks();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    fetchTasks();
});
