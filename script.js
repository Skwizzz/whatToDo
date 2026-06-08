const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filters button");
const priorityCheck = document.getElementById("priorityCheck");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);

function addTask() {
    const text = input.value.trim();
    const isPriority = priorityCheck.checked;

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        done: false,
        priority: isPriority
    });

    input.value = "";
    priorityCheck.checked = false;

    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.innerHTML = "";

    let filtered = tasks;

    if (currentFilter === "done") {
        filtered = tasks.filter(t => t.done);
    } else if (currentFilter === "todo") {
        filtered = tasks.filter(t => !t.done);
    }

    filtered.forEach(task => {
        const li = document.createElement("li");

        if (task.priority) {
            li.classList.add("priority");
        }

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.done ? "checked" : ""}>
                <span class="${task.done ? "done-text" : ""}">
                    ${task.text}
                </span>
            </div>
            <button class="delete">X</button>
        `;

        li.querySelector("input").addEventListener("change", (e) => {
            task.done = e.target.checked;
            saveTasks();
            renderTasks();
        });

        li.querySelector(".delete").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        list.appendChild(li);
    });
}

// FILTRES
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});