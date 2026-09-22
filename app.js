const storageKey = "clear-todo-items";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const template = document.querySelector("#task-template");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#task-count");
const clearCompleted = document.querySelector("#clear-completed");
const filters = document.querySelectorAll(".filter");
let activeFilter = "all";
let tasks = JSON.parse(localStorage.getItem(storageKey) || "[]");

const save = () => localStorage.setItem(storageKey, JSON.stringify(tasks));

function render() {
  list.replaceChildren();
  const visibleTasks = tasks.filter((task) => activeFilter === "all" || (activeFilter === "completed" ? task.done : !task.done));
  visibleTasks.forEach((task) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const toggle = item.querySelector(".task-toggle");
    const text = item.querySelector(".task-text");
    toggle.checked = task.done;
    text.textContent = task.text;
    toggle.addEventListener("change", () => { task.done = toggle.checked; save(); render(); });
    item.querySelector(".delete-task").addEventListener("click", () => { tasks = tasks.filter(({ id }) => id !== task.id); save(); render(); });
    list.append(item);
  });
  const remaining = tasks.filter((task) => !task.done).length;
  count.textContent = `${remaining}件の未完了タスク`;
  emptyState.hidden = visibleTasks.length > 0;
  clearCompleted.hidden = !tasks.some((task) => task.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, done: false });
  save(); input.value = ""; input.focus(); render();
});
filters.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filters.forEach((filter) => filter.classList.toggle("is-active", filter === button));
  render();
}));
clearCompleted.addEventListener("click", () => { tasks = tasks.filter((task) => !task.done); save(); render(); });
document.querySelector("#today").textContent = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date());
render();
