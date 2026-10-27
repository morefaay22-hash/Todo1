const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];

try {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch {
  tasks = [];
}

let currentFilter = "all";

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now() + Math.random(),
    text: text,
    completed: false,
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";

    if (currentFilter === "active") {
      emptyMessage.innerHTML =
        '<span class="empty-heart">♡</span><br>No active tasks. You got this! 💗';
    } else if (currentFilter === "completed") {
      emptyMessage.innerHTML =
        '<span class="empty-heart">♡</span><br>No completed tasks yet. 🌸';
    } else {
      emptyMessage.innerHTML =
        '<span class="empty-heart">♡</span><br>No tasks yet. Add something lovely!';
    }
  } else {
    emptyMessage.style.display = "none";
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    li.className = `task ${task.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const span = document.createElement("span");

    span.className = "task-text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete task: ${task.text}`);

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.append(checkbox, span, deleteBtn);

    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

renderTasks();

// Dark Mode Toggle

const themeToggle = document.getElementById("theme-toggle");

// Restore saved theme
const savedTheme = localStorage.getItem("basbosa-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// Toggle theme when clicking Basbosa
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  localStorage.setItem("basbosa-theme", isDark ? "dark" : "light");

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
});
