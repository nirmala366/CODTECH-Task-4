const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressDiv = document.getElementById('progress');

function saveTasks(tasks) {
  chrome.storage.sync.set({ tasks });
}

function loadTasks() {
  chrome.storage.sync.get('tasks', (data) => {
    const tasks = data.tasks || [];
    renderTasks(tasks);
  });
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  let completedCount = 0;
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) {
      li.classList.add('completed');
      completedCount++;
    }

    li.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks(tasks);
    });

    taskList.appendChild(li);
  });

  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  progressDiv.textContent = `Progress: ${progress}% completed`;
}

addTaskBtn.addEventListener('click', () => {
  const newTaskText = taskInput.value.trim();
  if (!newTaskText) return;

  chrome.storage.sync.get('tasks', (data) => {
    const tasks = data.tasks || [];
    tasks.push({ text: newTaskText, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    renderTasks(tasks);
  });
});

loadTasks();