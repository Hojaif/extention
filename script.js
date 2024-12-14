document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');

    // Load saved todos from storage
    chrome.storage.sync.get(['todos'], (result) => {
        if (result.todos) {
            result.todos.forEach((todo) => {
                addTodoToDOM(todo);
            });
        }
    });

    // Add a new to-do
    addButton.addEventListener('click', () => {
        const todoText = input.value.trim();
        if (todoText) {
            addTodoToDOM(todoText);
            saveTodoToStorage(todoText);
            input.value = '';
        }
    });

    // Add a task to the DOM
    function addTodoToDOM(todoText) {
        const li = document.createElement('li');
        li.textContent = todoText;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            deleteTodoFromDOM(li);
            deleteTodoFromStorage(todoText);
        });

        li.appendChild(deleteButton);
        todoList.appendChild(li);
    }

    // Save new task to chrome storage
    function saveTodoToStorage(todoText) {
        chrome.storage.sync.get(['todos'], (result) => {
            const todos = result.todos || [];
            todos.push(todoText);
            chrome.storage.sync.set({ todos });
        });
    }

    // Delete task from the DOM
    function deleteTodoFromDOM(todoItem) {
        todoList.removeChild(todoItem);
    }

    // Delete task from storage
    function deleteTodoFromStorage(todoText) {
        chrome.storage.sync.get(['todos'], (result) => {
            let todos = result.todos || [];
            todos = todos.filter(todo => todo !== todoText);
            chrome.storage.sync.set({ todos });
        });
    }
});
