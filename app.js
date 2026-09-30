const TASKS_KEY = "today-todo-items";
const THEME_KEY = "today-todo-theme";
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const themeToggle = document.querySelector("#theme-toggle");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = readStoredTodos();
let activeFilter = "all";

function readStoredTodos() {
  try {
    const storedTodos = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    return Array.isArray(storedTodos)
      ? storedTodos.filter((todo) => todo && typeof todo.id === "string" && typeof todo.text === "string")
        .map((todo) => ({ ...todo, completed: Boolean(todo.completed) }))
      : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(todos));
  } catch {
    emptyState.textContent = "目前無法儲存資料，請檢查瀏覽器的儲存設定。";
    emptyState.hidden = false;
  }
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀️" : "🌙";
  themeToggle.querySelector(".theme-label").textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-label", isDark ? "切換淺色模式" : "切換深色模式");
}

function renderTodos() {
  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed;
    if (activeFilter === "completed") return todo.completed;
    return true;
  });

  todoList.replaceChildren();
  for (const todo of visibleTodos) {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " is-completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "todo-check";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為${todo.completed ? "未完成" : "已完成"}`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemToKeep) => itemToKeep.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    todoList.append(item);
  }

  remainingCount.textContent = `未完成：${todos.filter((todo) => !todo.completed).length} 項`;
  emptyState.hidden = visibleTodos.length > 0;
  if (visibleTodos.length === 0) {
    if (todos.length === 0) {
      emptyState.textContent = "還沒有待辦事項，新增一項開始吧。";
    } else if (activeFilter === "active") {
      emptyState.textContent = "沒有未完成事項。";
    } else if (activeFilter === "completed") {
      emptyState.textContent = "還沒有已完成事項。";
    } else {
      emptyState.textContent = "目前沒有待辦事項。";
    }
  }
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false });
  saveTodos();
  todoInput.value = "";
  activeFilter = "all";
  updateFilterButtons();
  renderTodos();
  todoInput.focus();
});

function updateFilterButtons() {
  for (const button of filterButtons) {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    updateFilterButtons();
    renderTodos();
  });
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // 主題仍可在目前頁面切換，即使瀏覽器不允許儲存偏好。
  }
});

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
systemTheme.addEventListener("change", (event) => {
  try {
    if (localStorage.getItem(THEME_KEY) === null) applyTheme(event.matches ? "dark" : "light");
  } catch {
    applyTheme(event.matches ? "dark" : "light");
  }
});

applyTheme(getInitialTheme());
updateFilterButtons();
renderTodos();
