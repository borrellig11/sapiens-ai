const searchRoutes = require('./routes/search');
const historyRoutes = require('./routes/history');
const chatRoutes = require('./routes/chat');

// ... under your session middleware ...
app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/chat', chatRoutes);
