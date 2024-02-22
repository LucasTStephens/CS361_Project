var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")
const mysql = require("mysql")
const dotenv = require('dotenv')
const bcrypt = require("bcryptjs")

var app = express()

var userid = 0;
var userEmail = "";
var userName = "";
var userDescription = "";
var favoriteGenre = 0;

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

var genreInfo = "";
db.query('SELECT gid, gname FROM genres', async (error, ress) => {
    genreInfo = ress;
})

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
    db.query('SELECT shows.name, genres.gname FROM profiles_shows JOIN shows ON profiles_shows.sid = shows.sid JOIN genres ON shows.gid = genres.gid WHERE profiles_shows.uid = ?', [userid], async (error, ress) => {
        res.status(200).render("homepage", {
            show: ress,
            genre: genreInfo
        })
    })
})

app.get("/shows/recommended", function(req, res){
    res.status(200).render("recommendedShows")
})

app.get("/shows/profile", function(req, res){
    res.status(200).render("profileShows")
})

app.get("/profile", function(req, res){ 
    res.status(200).render("profile", {
        genre: genreInfo
    })
})

app.get('*', function (req, res) {
    res.status(404).render("404")
})

app.listen(3231, () => {
    console.log(`Server is running on http://flip?.engr.oregonstate.edu:3231/`);
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
            db.query('SELECT uid, name, description, favoriteGenre FROM profiles WHERE email = ?', [email], async (error, resss) => {
                userEmail = email
                userid = resss[0].uid
                userName = resss[0].name
                userDescription = resss[0].description
                favoriteGenre = resss[0].favoriteGenre
                db.query('SELECT shows.name, genres.gname FROM profiles_shows JOIN shows ON profiles_shows.sid = shows.sid JOIN genres ON shows.gid = genres.gid WHERE profiles_shows.uid = ?', [userid], async (error, ressss) => {
                    res.status(200).render("homepage", {
                        show: ressss,
                        genre: genreInfo
                    })
                })
            })
        }
    })
    
})

app.post("/profile", (req, res) => {
    const email = userEmail
    const name = req.body['name-input']
    const description = req.body['description-input']
    const favoriteGenre = req.body['genre-input']

    db.query('UPDATE profiles SET name = ?, description = ?, favoriteGenre = ? WHERE email = ?', [name, description, favoriteGenre, email], async (error, ress) => {
        if (error){
            console.log(error)
        }
        else {
            res.status(200).render("profile", {
                genre: genreInfo,
                message: "Profile Updated!"
            })
        }
    })
})


// Checks if there is already a show existing and adds it to list if not already added.
app.post("/homepage", (req, res) => {
    const name = req.body['show-title-input']
    const genre = req.body['show-genre-input']

    db.query('SELECT sid FROM shows WHERE name = ?', [name], async (error, ress) => {
        if (ress.length > 0) {
            console.log(ress)
            db.query('SELECT * FROM profiles_shows WHERE sid = ? AND uid = ?', [ress[0].name, userid], async (error, resss) => {
                if (resss.length > 0) {
                    db.query('SELECT shows.name, genres.gname FROM profiles_shows JOIN shows ON profiles_shows.sid = shows.sid JOIN genres ON shows.gid = genres.gid WHERE profiles_shows.uid = ?', [userid], async (error, ressss) => {
                        res.status(200).render("homepage", {
                            show: ressss,
                            message: 'Show is already on your list',
                            genre: genreInfo
                        })
                    })
                }
                else {
                    db.query('INSERT INTO profiles_shows (uid, sid) VALUES (?, (SELECT sid FROM shows WHERE name = ?))', [userid, name], async (error, resss) => {
                        db.query('SELECT shows.name, genres.gname FROM profiles_shows JOIN shows ON profiles_shows.sid = shows.sid JOIN genres ON shows.gid = genres.gid WHERE profiles_shows.uid = ?', [userid], async (error, ressss) => {
                            res.status(200).render("homepage", {
                                show: ressss,
                                genre: genreInfo
                            })
                        })
                    })
                }
            })
        }
        else {
            db.query('INSERT INTO shows (name, gid) VALUES (?, ?)', [name, genre], async (error, ress) => {
                if (error) {
                    console.log(error)
                }
                else {
                    db.query('INSERT INTO profiles_shows (uid, sid) VALUES (?, (SELECT sid FROM shows WHERE name = ?))', [userid, name], async (error, resss) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            db.query('SELECT shows.name, genres.gname FROM profiles_shows JOIN shows ON profiles_shows.sid = shows.sid JOIN genres ON shows.gid = genres.gid WHERE profiles_shows.uid = ?', [userid], async (error, ressss) => {
                                res.status(200).render("homepage", {
                                    show: ressss,
                                    genre: genreInfo
                                })
                            })
                        }
                    })
                }
            })
        }
    })
})