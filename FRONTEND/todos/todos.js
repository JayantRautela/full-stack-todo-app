async function showTodos() {
    const todosResponse = await axios.get('http://localhost:3000/todos', {
        headers : {
        token: localStorage.getItem("token")
    }
    })
    const todoBox = document.querySelector(".todo-container");
    todoBox.innerHTML = '';
    todosResponse.data.forEach(todoItem => {
        const todo = todoItem.todo;
        const id = todoItem.id;

        const todoList = document.createElement('div'); 
        todoList.classList.add("todo-box");

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';

        const todoText = document.createTextNode(todo);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete"
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTodo(id));

        todoList.appendChild(checkBox);
        todoList.appendChild(todoText);
        todoList.appendChild(deleteButton);
        todoBox.appendChild(todoList);
    });
}

async function deleteTodo(id) {
    try {
        const response = await axios.delete('http://localhost:3000/delete-todo', {
            data: {
                id: id
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        if  (response.status === 200) {
            alert("Todo deleted successfully");
            location.reload();
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                alert("Todo cannot be deleted due to internal server error.")
            }
        } else if (error.request) {
            alert("Cannot add todo due to network error");
        } else {
            alert("Some error occured " + error.message);
        }
    }
}

const form = document.querySelector(".input-box");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const todo = document.querySelector('.todo-input').value;

    if (!(document.querySelector('.todo-input').value)) {
        alert("Empty Input Fields");
    }

    try {
        const response = await axios.post('http://localhost:3000/add-todo', {
            todo: todo
        }, {
            headers: {
                token: localStorage.getItem("token")
            }
        })

        if (response.status === 201) {
            alert("Todo created successfully");
            location.reload();
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                alert("Empty Input field");
            } else if (error.response.status === 500) {
                alert("Cannot add todo due to internal server error");
            }
        } else if (error.request) {
            alert("Cannot add todo due to network error");
        } else {
            alert("Some error occured " + error.message);
        }
    }
    todo.value = "";
})

async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Cannot access page, User not signed in");
    }

    try {
        const response = await axios.get('http://localhost:3000/me', {
            headers : {
                token: localStorage.getItem("token")
            }
        })
        if (response.status === 200) {
            const username = response.data.username.username;
            document.querySelector('.status').innerHTML = `Hello, ${username}`;
            showTodos();
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                alert("You are not signed in")
            } 
        } else if (error.request) {
            alert("Check your network and try again");
        } else {
            alert("Some error occured : " + error.message);
        }
    }
}

window.onload = loadProfile;