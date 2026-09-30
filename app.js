const THEME_STORAGE_KEY = "daily-list-theme";
const TODO_STORAGE_KEY = "daily-list-items";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll("[data-filter]");

let selectedFilter = "all";
let todos = loadTodos();

function storedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
}

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedTodos)) return [];
    return savedTodos.filter((todo) => (
      todo && typeof todo.id === "string" && typeof todo.text === "string" && typeof todo.completed === "boolean"
    ));
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function visibleTodos() {
  if (selectedFilter === "active") return todos.filter((todo) => !todo.completed);
  if (selectedFilter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

function updateEmptyState() {
  const messages = {
    all: "還沒有待辦事項，先新增一件吧。",
    active: "目前沒有未完成的事項。",
    completed: "目前還沒有已完成的事項。",
  };
  emptyState.textContent = messages[selectedFilter];
  emptyState.hidden = visibleTodos().length > 0;
}

function renderTodos() {
  const shownTodos = visibleTodos();
  todoList.replaceChildren();

  shownTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " is-complete" : ""}`;

    const toggleButton = document.createElement("button");
    toggleButton.className = "todo-check";
    toggleButton.type = "button";
    toggleButton.setAttribute("aria-label", todo.completed ? `標記「${todo.text}」為未完成` : `完成「${todo.text}」`);
    toggleButton.setAttribute("aria-pressed", String(todo.completed));
    toggleButton.textContent = todo.completed ? "✓" : "";
    toggleButton.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(toggleButton, text, deleteButton);
    todoList.append(item);
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成：${remainingCount} 項`;
  updateEmptyState();
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

systemTheme.addEventListener("change", (event) => {
  if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
});

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  todos.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTodos();
  todoInput.value = "";
  selectedFilter = "all";
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === selectedFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderTodos();
  todoInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

applyTheme(storedTheme() || (systemTheme.matches ? "dark" : "light"));
renderTodos();