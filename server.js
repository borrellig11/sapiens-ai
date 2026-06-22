const express = require('express');
const path = require('path');
const session = require('express-session');
const Database = require('./db/database');
const searchRoutes = require('./routes/search');
const historyRoutes = require('./routes/history');
const chatRoutes = require('./routes/chat');

const app = express();

// DATABASE INIT
const db = new Database();
db.initialize();

// MIDDLEWARE
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'sapiens-key', resave: false, saveUninitialized: true }));

// DB ACCESS
app.use((req, res, next) => { 
    req.db = db; 
    next(); 
});

// ROUTES
app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/chat', chatRoutes);

app.listen(3000, () => console.log("🧠 Sapiens Server running at http://localhost:3000"));
