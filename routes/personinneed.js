const express = require('express');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const app = express.Router();

// Person in Need Dashboard
app.get('/dashboard', isAuthenticated, authorizeRole(['personinneed']), (req, res) => {
    res.render('personinneed/dashboard', { user: req.session.user });
});

// Create Request
app.get('/create-request', isAuthenticated, authorizeRole(['personinneed']), (req, res) => {
    res.render('personinneed/create_request', { user: req.session.user });
});

// View Requests
app.get('/requests', isAuthenticated, authorizeRole(['personinneed']), (req, res) => {
    res.render('personinneed/requests', { user: req.session.user });
});

// View History
app.get('/history', isAuthenticated, authorizeRole(['personinneed']), (req, res) => {
    res.render('personinneed/history', { user: req.session.user });
});

module.exports = app;
