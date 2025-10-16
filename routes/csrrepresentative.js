const express = require('express');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const app = express.Router();

// CSR Representative Dashboard
app.get('/dashboard', isAuthenticated, authorizeRole(['csrrepresentative']), (req, res) => {
    res.render('csrrepresentative/dashboard', { user: req.session.user });
});

// Search Requests
app.get('/search-requests', isAuthenticated, authorizeRole(['csrrepresentative']), (req, res) => {
    res.render('csrrepresentative/search_requests', { user: req.session.user });
});

// Shortlist Management
app.get('/shortlist', isAuthenticated, authorizeRole(['csrrepresentative']), (req, res) => {
    res.render('csrrepresentative/shortlist', { user: req.session.user });
});

module.exports = app;
