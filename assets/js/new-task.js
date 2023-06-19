document.getElementById('confirmButton').addEventListener('click', function(e) {
    e.preventDefault();

    let taskInput = document.getElementById('taskInput');
    let priorityCheck = document.getElementById('priorityCheck');

    var uhub = JSON.parse(localStorage.getItem("uhub"));
    let tasks = uhub.tasks;

    tasks.push({
        text: taskInput.value,
        priority: priorityCheck.checked,
        completed: false
    });

    localStorage.setItem("uhub", JSON.stringify(uhub));

    window.location.href = "index.html";
});
