const express = require('express');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const app = express.Router();

// Platform Manager Dashboard
app.get('/dashboard', isAuthenticated, authorizeRole(['platformmanager']), (req, res) => {
    res.render('platformmanager/dashboard', { user: req.session.user });
});

// Category Management
app.get('/categories', isAuthenticated, authorizeRole(['platformmanager']), (req, res) => {
    res.render('platformmanager/categories', { user: req.session.user });
});

// Reports
app.get('/reports', isAuthenticated, authorizeRole(['platformmanager']), (req, res) => {
    res.render('platformmanager/reports', { user: req.session.user });
});

module.exports = app;
