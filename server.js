const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const Database = require('./db/database');
const searchRoutes = require('./routes/search');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
const db = new Database();
db.initialize();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'sapiens-ai-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Sapiens AI' });
});

app.listen(PORT, () => {
  console.log(`🧠 Sapiens AI is running on http://localhost:${PORT}`);
  console.log('📚 Free studying platform powered by AI');
});
