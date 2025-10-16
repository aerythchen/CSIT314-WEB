const express = require('express');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const app = express.Router();

// User Admin Dashboard
app.get('/dashboard', isAuthenticated, authorizeRole(['useradmin']), (req, res) => {
    res.render('useradmin/dashboard', { user: req.session.user });
});

// User Profile Management
app.get('/profiles', isAuthenticated, authorizeRole(['useradmin']), (req, res) => {
    res.render('useradmin/profiles', { user: req.session.user });
});

// User Account Management
app.get('/accounts', isAuthenticated, authorizeRole(['useradmin']), (req, res) => {
    res.render('useradmin/accounts', { user: req.session.user });
});

module.exports = app;
