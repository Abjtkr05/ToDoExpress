const express = require('express')
const app = express();
const fs = require('fs');
const session = require('express-session')

app.use(express.static(`${__dirname}`))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.set("view engine", "ejs")

//sending-page
app.get("/", home)
app.get("/login", loginpage)

//form-request-handling
app.post('/login', login);
app.post('/signup', signin);

//logout
app.post('/logout', logout)

//updating-todo-list
app.route('/todoo').post(postTodo)
app.post('/todoRemove', remove);

//function for sending home page
function home(req, res) {
    if (req.session.logedInStatus) {
        getTodo((err, data) => {
            data = data.filter(val => {
                return val.createdBy === req.session.userName;
            })
            res.render('todoListPage', {data: data, userName: req.session.userName})
        })
    } else {
        res.redirect('/login')
    }
}

//function for sending login page
function loginpage(req, res) {
    if (req.session.logedInStatus) {
        res.redirect('/')
    } else {
        res.sendFile(__dirname + '/loginSignup/index.html')
    }
}

//function for logging out
function logout(req, res) {
    // console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }

    })
}

//function for handling login request of form
function login(req, res) {

    getData((err, data) => {
        if (err) {
            console.log(err)
        } else {
            const user = data.filter((user) => {
                if (user.username === req.body.username && user.password === req.body.password) {
                    return true;
                }
            })
            if (user.length === 1) {
                req.session.logedInStatus = true;
                req.session.userName = user[0].username
                res.redirect('/');
            } else {

                res.end("signup failed")
            }
        }
    })

}

//function for handling sign-up request of form
function signin(req, res) {
    getData((err, data) => {
        if (err) {
            console.log(err)
        } else {
            let val;
            const user = data.filter((user) => {
                if (user.username === req.body.username || user.email === req.body.email) {
                    val = user.username === req.body.username ? "username" : "email"
                    return true;
                }
            })
            if (user.length === 0) {
                data.push(req.body)
                saveData(data, (err) => {
                    console.log(err)
                })
                req.session.logedInStatus = true;
                req.session.userName = req.body.username
                res.redirect('/');
            } else {
                console.log()
                res.end("signup Failed")
            }

        }
    })
}

//helper function to get data from users.txt
function getData(callback) {
    fs.readFile("./loginSignup/users.txt", "utf-8", (err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, JSON.parse(data))
        }

    })
}

//helper function to save data from users.txt
function saveData(data, callback) {
    fs.writeFile("./loginSignup/users.txt", JSON.stringify(data), (err) => {
        if (err) {
            callback(err)
        }
    })
}

//function for retrieving to-do data and saving in todo.txt
function postTodo(req, res) {
    getTodo((err, data) => {
        if (err) {
            res.end(err)
        } else {
            const todo = {
                text: req.body.text,
                createdBy: req.session.userName
            }
            data.push(todo)
            saveTodo(data, (err) => {
                if (err) {
                    res.end();
                }
            })
        }
    })
}

//helper function for saving and retrieving data from todo.txt
function getTodo(callback) {
    fs.readFile("./todoList.txt", "utf-8", (err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, JSON.parse(data))
        }
    })
}

function saveTodo(data, callback) {
    fs.writeFile("./todoList.txt", JSON.stringify(data), err => {
        if (err) {
            callback(err)
        }
    })
}

//function for deleting data
function remove(req, res) {
    getTodo((err, toDo) => {
        if (err) {
            res.end('Sorry An Error Occoured Awwww!')
        } else {
            toDo = toDo.filter(val => {
                return !(val.text === req.body.text && val.createdBy === req.session.userName)
            })
            saveTodo(toDo, (err, data) => {
                res.end();
            })
            res.end()
        }
    })
}


module.exports = app;