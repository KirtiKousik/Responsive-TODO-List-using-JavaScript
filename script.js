const data = new Date();

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
document.getElementById("date").innerHTML = today.toDateString();

function time() {
  const data = new Date();
  let h = data.getHours();
  let m = data.getMinutes();
  let s = data.getSeconds();

  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;

  document.getElementById("hour").innerHTML = h + ":" + m + ":" + s;
  setTimeout("time()", 500);
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;
  if (inputValue) saveTodo(inputValue);
});

// A function to save the todo list to the local storage
const saveToStorage = () => {
  const todos = document.querySelectorAll(".todo");
  const todoArray = [];
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText;
    const todoDone = todo.classList.contains("done");
    todoArray.push({ title: todoTitle, done: todoDone });
  });
  localStorage.setItem("todos", JSON.stringify(todoArray));
};

// A function to load the todo list from the local storage
const loadFromStorage = () => {
  if (localStorage.getItem("todos") === null) {
    // If there is no data in the local storage, save the default task
    const defaultTask = document.querySelector(".todo");
    const defaultTitle = defaultTask.querySelector("h3").innerText;
    const defaultDone = defaultTask.classList.contains("done");
    localStorage.setItem(
      "todos",
      JSON.stringify([{ title: defaultTitle, done: defaultDone }])
    );
  }
  const todoArray = JSON.parse(localStorage.getItem("todos"));
  if (todoArray) {
    todoArray.forEach((todo) => {
      const text = todo.title;
      const done = todo.done;
      createTodoElement(text, done);
    });
  }
};

// A function to create a todo element and append it to the list
const createTodoElement = (text, done) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  if (done) todo.classList.add("done"); // Add the done class if the task is completed

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-todo");
  removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(removeBtn);

  todoList.appendChild(todo);
};

// A function to save a new todo and create its element
const saveTodo = (text) => {
  createTodoElement(text, false);
  saveToStorage(); // Save the list after adding a new task
  todoInput.value = "";
};

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3"))
    todoTitle = parentEl.querySelector("h3").innerText;

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    saveToStorage(); // Save the list after marking a task as done or undone
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    saveToStorage(); // Save the list after removing a task
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  if (editInputValue) updateTodo(editInputValue); //Update value function

  toggleForms();
  saveToStorage(); // Save the list after editing a task
});

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) todoTitle.innerText = text;
  });
};

// Load the list from the storage when the page loads
window.addEventListener("load", loadFromStorage);
