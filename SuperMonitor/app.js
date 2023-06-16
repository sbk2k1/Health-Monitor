const express = require('express');
const app = express();

// Database
require("./services/db")

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Run schedule
require('./services/scheduleapi');
require('./services/schedulesql');

// ------------------ Home ------------------
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './views' });
});

// ------------------ About ------------------

// about.html in views
app.get('/about', (req, res) => {
    res.sendFile('about.html', { root: './views' });
});


// ------------------ Documentation  ------------------

// API documentation 

// api routes
// /api/workspace - get - get all workspaces
// /api/workspace - post - create a workspace
// /api/workspace/:id - get - get a workspace by id

// /api/connection - get - get all connections
// /api/connection - post - create a connection

// sql routes
// /sql/workspace - get - get all workspaces
// /sql/workspace - post - create a workspace
// /sql/workspace/:id - get - get a workspace by id

// /sql/connection - get - get all connections
// /sql/connection - post - create a connection


// ------------------ Pages ------------------

// ------------------ API ------------------

// 1. API Workspace page to create a workspace or go to a workspace (dashboard) from a list of workspaces

app.get('/api/select', (req, res) => {
    res.sendFile('apiSelect.html', { root: './views' });
});

// 2. API Connection page on going to a dashboard. We can create connection and monitor existing connections from here.

app.get('/api/dashboard/:workspace', (req, res) => {
    res.sendFile('apiDashboard.html', { root: './views' });
});

// ------------------ SQL ------------------

// 1. SQL Workspace page to create a workspace or go to a workspace (dashboard) from a list of workspaces

app.get('/sql/select', (req, res) => {
    res.sendFile('sqlSelect.html', { root: './views' });
});

// 2. SQL Connection page on going to a dashboard. We can create connection and monitor existing connections from here.

app.get('/sql/dashboard/:workspace', (req, res) => {
    res.sendFile('sqlDashboard.html', { root: './views' });
});



// ------------------ API & SQL------------------

// Routes
const apiRoutes = require('./routes/apiRoutes');
const sqlRoutes = require('./routes/sqlRoutes');

app.use('/api', apiRoutes);
app.use('/sql', sqlRoutes);


// ------------------ 404 ------------------

// 404 Error
app.use((req, res) => {
    res.status(404).send('404 Error: Page not found');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
