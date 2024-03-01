const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_stephluc',
    password: '6881',
    database: 'cs340_stephluc'
});

// MongoDB connection
const mongoClient = new MongoClient('mongodb://localhost:27017');
const dbName = 'your_mongodb_database';
let mongoCollection;

mongoClient.connect((err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = mongoClient.db(dbName);
    mongoCollection = db.collection('last_recommended_show');
});

app.get('/random-show', (req, res) => {
    db.query('SELECT * FROM shows ORDER BY RAND() LIMIT 1', (error, results) => {
        if (error) {
            console.error('Error selecting random show:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const randomShow = results[0];
        res.json({ randomShow });
    });
});

app.listen(3001, () => {
    console.log(`Random Show Microservice running on http://localhost:3001`);
});
