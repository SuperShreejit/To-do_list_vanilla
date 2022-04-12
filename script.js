const listContainer = document.querySelector('[data-lists]');
const TodoListContainer = document.getElementById('todo-list');
const taskContainer = document.querySelector("[data-tasks]");
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const deleteListBtn = document.querySelector("[data-delete-list-btn]");
const deletetaskBtn = document.querySelector("[data-delete-task-btn]");
const ListTitleElement = document.getElementById("todo-list-title");
const taskCountElement = document.getElementById("task-count");

const LOCAL_STORAGE_LIST_KEY = 'task.lists',
  LOCAL_STORAGE_SELECTED_KEY_ID = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [],
  selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_KEY_ID) || "";

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  SaveAndRender();
});

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  lists.forEach(list=>{
    if(list.id === selectedListId){
      list.tasks.push(task);
    }
  });
  SaveAndRender();
});

deleteListBtn.addEventListener('click', ()=>{
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  SaveAndRender();
});

deletetaskBtn.addEventListener('click', ()=>{
  const selectedList = findSelectedList();
  selectedList.tasks = selectedList.tasks.filter(task => task.complete == false);
  SaveAndRender();
});

listContainer.addEventListener('click', e => {
  if(e.target.classList.contains('task-list-item')){
    selectedListId = e.target.dataset.listId.toString();
    SaveAndRender();
  }
});

taskContainer.addEventListener('click', e => {
  if (e.target.closest(".checkbox-container")) {    
    const checkboxContainer = e.target.closest(".checkbox-container");
    const inputElement = document.getElementById(checkboxContainer.htmlFor);
    toggleCheckbox(inputElement);    
    const selectedList = findSelectedList();
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === checkboxContainer.htmlFor
      );
    selectedTask.complete = inputElement.checked;
    saveList();
    renderTaskCount(selectedList);
    render();
  }
});

function toggleCheckbox(checkbox) {
  if (checkbox.checked) checkbox.checked = false;
  else checkbox.checked = true;
}


function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

function SaveAndRender() {
  saveList();
  render();
}

function saveList() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_KEY_ID, selectedListId);
}

function render() {
  clearElement(listContainer);
  const selectedList = findSelectedList();
  renderLists();
  if(!selectedList){
    TodoListContainer.style.display = 'none';
  }
  else {
    TodoListContainer.style.display = 'block';
    clearElement(taskContainer);
    ListTitleElement.innerText = selectedList.name;  
    renderTaskCount(selectedList);
    renderTasks(selectedList);
  }
}

function renderTaskCount(selectedList) {
  if(selectedList.tasks == []) return;
  else{
    const incompleteTasks =  selectedList.tasks.filter(task => !task.complete).length;
    const tasksString = (incompleteTasks === 1)? "task remaining" : "tasks remaining";
    taskCountElement.innerText = `${incompleteTasks} ${tasksString}`;
  }
}

function renderTasks(selectedList){
  selectedList.tasks.forEach(task=>{ 
    const inputElement = document.createElement('input');
    const labelElement = document.createElement('label');
    const taskNameElement = document.createElement('span');
    const checkboxElement = document.createElement('span');
    inputElement.type = "checkbox";
    inputElement.id= task.id;
    inputElement.checked = task.complete;
    labelElement.htmlFor = task.id;
    labelElement.classList.add('checkbox-container')
    taskNameElement.classList.add('label');
    taskNameElement.innerText = task.name;
    checkboxElement.classList.add('custom-checkbox');
    labelElement.appendChild(checkboxElement);
    labelElement.appendChild(taskNameElement);
    taskContainer.appendChild(inputElement);
    taskContainer.appendChild(labelElement);
  });
}

function renderLists() {
  lists.forEach(list=>{
    const listElement = document.createElement('li');
    listElement.classList.add('task-list-item');
    listElement.dataset.listId = list.id;
    listElement.innerText=list.name;
    if(list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listContainer.appendChild(listElement);
  });
}

function clearElement(element){
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function findSelectedList() {
  return lists.find((list) => list.id === selectedListId);
}

render();