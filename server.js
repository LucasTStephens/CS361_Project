var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")
const mysql = require("mysql")
const dotenv = require('dotenv')
const bcrypt = require("bcryptjs")

var app = express()

dotenv.config({ path: './.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.use(express.urlencoded({extended: 'false'}))
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())

app.engine("handlebars", exphbs.engine({defaultLayout: null}))
app.set("view engine", "handlebars")

app.get("/", function(req, res){
    res.status(200).render("login")
})

app.get("/login", function(req, res){
    res.status(200).render("login")
})

app.get("/signup", function(req, res){
    res.status(200).render("signup")
})

app.get("/homepage", function(req, res){
    res.status(200).render("homepage")
})

app.get("/shows/recommended", function(req, res){
    res.status(200).render("recommendedShows")
})

app.get("/shows/profile", function(req, res){
    res.status(200).render("profileShows")
})

app.get("/profile", function(req, res){
    res.status(200).render("profile", {
        name: "placeholder",
        description: "placeholder"
    })
})

app.get('*', function (req, res) {
    res.status(404).render("404")
})

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000/`);
})

// Code to register a user if they are not already in the system
app.post("/signup", (req, res) => {    
    const email = req.body['email-input']
    const password = req.body['password-input']

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, ress) => {
        if(error){
            console.log(error)
        }
        if( ress.length > 0 ) {
            return res.render('signup', {
                message: 'This email is already in use'
            })
        }

        db.query('INSERT INTO users SET?', {email: email, password: password}, (error, ress) => {
            if(error) {
                console.log(error)
            } 
            else {
                db.query('INSERT INTO profiles SET?', {email: email}, (error, resss) => {
                    if(error) {
                        console.log(error)
                    }
                })
                return res.render('signup', {
                    message: 'User registered!'
                })
            }
        })
     })
})

const email = "";

// Code to check credentials entered into login
app.post("/login", (req, res) => {    
    const email = req.body['email-input']
    const password = req.body['password-input']

    db.query('SELECT email FROM users WHERE email = ? AND password = ?', [email, password], async (error, ress) => {
        if(error){
            console.log(error)
        }
        if( ress.length == 0 ) {
            return res.render('login', {
            message: 'Email or password incorrect'
        })
    }
        if( ress.length > 0 ) {
            db.query('SELECT name, description FROM profiles WHERE email = ?', [email], async (error, resss) => {
                // can save name and description here
            })
            return res.render('homepage')
        }
    })
    
})

app.post("/profile", (req, res) => {
    const email = 'email@email.com'
    const name = req.body['name-input']
    const description = req.body['description-input']

    db.query('UPDATE profiles SET name = ?, description = ? WHERE email = ?', [name, description, email], async (error, ress) => {
        if (error){
            console.log(error)
        }
        else {
            
            return res.render("profile", {
                message: "Profile Updated!"
            })
        }
    })
})
