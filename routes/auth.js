const express = require('express');
const app = express.Router();

// GET /auth/login - Display login form
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect(`/${req.session.user.userType}/dashboard`);
    }
    res.render('auth/login', { error: null, user: null });
});

// POST /auth/login - Handle login submission
app.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    let Boundary;
    switch (userType) {
        case 'useradmin':
            Boundary = require('../boundary/useradmin_login');
            break;
        case 'platformmanager':
            Boundary = require('../boundary/platformmanager_login');
            break;
        case 'csrrepresentative':
            Boundary = require('../boundary/csrrepresentative_login');
            break;
        case 'personinneed':
            Boundary = require('../boundary/personinneed_login');
            break;
        default:
            return res.render('auth/login', {
                error: 'Invalid user type',
                user: null
            });
    }

    const boundary = new Boundary();
    
    // Ensure email and password are strings
    const loginData = {
        email: String(email || ''),
        password: String(password || '')
    };
    
    const result = await boundary.handleLogin(loginData.email, loginData.password);
    
    console.log('Login result:', JSON.stringify(result, null, 2));

    if (result.success) {
        req.session.user = {
            id: result.data.user.id,
            email: result.data.user.email,
            firstName: result.data.user.firstName,
            userType: result.data.user.userType
        };
        return res.redirect(`/${userType}/dashboard`);
    } else {
        return res.render('auth/login', { error: result.error, user: null });
    }
});

// GET /auth/logout - Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/error');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

module.exports = app;
