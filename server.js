var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")
const mysql = require("mysql")
const dotenv = require('dotenv')

var app = express()

app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())

app.engine("handlebars", exphbs.engine({defaultLayout: null}))
app.set("view engine", "handlebars")

app.get("/", function(req, res){
    res.status(200).render("login")
})

app.get('*', function (req, res) {
    res.status(404).render("404")
})

app.listen(3333, () => {
    console.log(`Server is running on http://localhost:3333`);
});
