const express = require('express');
const path = require('path');
const session = require('express-session');
const Database = require('./db/database');
const searchRoutes = require('./routes/search');
const historyRoutes = require('./routes/history');
const chatRoutes = require('./routes/chat');

const app = express();
const db = new Database();
db.initialize();

app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'sapiens-key', resave: false, saveUninitialized: true }));

app.use((req, res, next) => { req.db = db; next(); });

app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/chat', chatRoutes);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
