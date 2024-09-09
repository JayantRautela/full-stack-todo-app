const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const port = 3000;
const JWT_SECRET = 'bf8297930f4c5be512377e0d6e80176ac825398dfb573496110143affb7f6bb3';
const users = [];
let todos = [];

app.use(express.json());
app.use(cors());

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            message: "Empty input fields"
        })
        return;
    }

    const user = users.find(u => u.username === username);
    if (user) {
        res.status(400).json({
            message: "User already exists."
        });
        return;
    }

    users.push({
        username: username,
        password: password
    });

    res.status(200).json({
        message: "User is successfully signed up!!"
    });
})

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            message: "Empty input fields"
        })
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if(!user) {
        res.status(401).json({
            message: "Invalid input credentials"
            });
        return;
    }

    if(user) {
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);

        user.token = token;
        res.status(200).json({
            message: "User successfully signed in!!",
            token: token
        });
    }
})

function auth (req, res, next) {
    const token =  req.headers.authorization;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({
                    message: "Unauthorized"
                })
            } else {
                req.user = decoded;
                next();
            }
        })
    } else {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

app.use(auth);

app.get('/todos', (req, res) => {
    if (todos.length === 0) {
        res.status(200).json({
            message: "No todos to show",
            todos
        })
    }
    res.status(200).json(todos);
})

app.post('/add-todo', (req, res) => {
    const { todo } = req.body;
    
    if (!todo) {
        res.status(400).json({
            message: "Empty todo field!!"
        })
        return;
    }

    todos.push({
        todo: todo,
        completed: false
    });

    res.status(201).json({
        message: "Todo created successfully"
    });
})

app.put('/update-todo', (req, res) => {
    const { todo, updated_todo } = req.body;

    if (!updated_todo) {
        res.status(400).json({
            messgae: "Empty Update Todo Field"
        });
        return;
    }

    const todoToUpdate = todos.find(t => t.todo === todo);
    todoToUpdate.todo = updated_todo;

    res.status(200).json({
        message: "Todo updated successfully",
        todos
    })
})

app.delete('/delete-todo', (req, res) => {
    const { todoToDelete } = req.body;
    
    const index = todos.findIndex(t => t.todo === todoToDelete);

    todos.splice(index, 1);

    res.status(200).json({
        message: "Todo deleted successfully",
        todos 
    });
});

app.post('/completed', (req, res) => {
    const { completedTodo } = req.body;

    const todo = todos.find(t => t.todo === completedTodo);

    todo.completed = true;
    res.status(200).json({
        messgae: "Todo completed"
    })
})


app.listen(port, () => {
        console.log(`the server is started at http://localhost:${port}`);
})
