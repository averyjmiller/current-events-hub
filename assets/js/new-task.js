document.getElementById('confirmButton').addEventListener('click', function(e) {
    e.preventDefault();

    let taskInput = document.getElementById('taskInput');
    let priorityCheck = document.getElementById('priorityCheck');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push({
        text: taskInput.value,
        priority: priorityCheck.checked,
        completed: false
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    window.location.href = "index.html";
});
