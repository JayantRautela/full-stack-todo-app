const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const port = 3000;
const JWT_SECRET = 'bf8297930f4c5be512377e0d6e80176ac825398dfb573496110143affb7f6bb3';
const users = [];
const todos = [];

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
            message: "Either the username or the password is wrong"
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
    const token = req.headers.authorization;

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

app.use(auth());

app.get('/todos', (req, res) => {
    if (todos.length === 0) {
        res.status(404).json({
            message: "No todos to show"
        })
    }
    res.json(todos);
})



app.listen(port, () => {
        console.log(`the server is started at http://localhost:${port}`);
})
