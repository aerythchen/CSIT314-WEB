const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { seedDatabase, db } = require('./database'); // Import db and seedDatabase

// Pure BCE Architecture - No Routes

const app = express();
const PORT = 3000;

// Initialize and seed the database
console.log('🌱 Initializing database...');
try {
    // Ensure tables are created before seeding
    for (const tableName in require('./database/models')) {
        db.createTable(tableName);
    }
    seedDatabase();
    console.log('✅ Database initialized successfully!');
} catch (error) {
    console.error('❌ Failed to initialize or seed database:', error);
    process.exit(1); // Exit if database cannot be initialized
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Pure BCE Architecture - Direct Boundary Access via POST
// Single endpoint for all boundary operations

// Single POST endpoint for all BCE operations
app.post('/bce/:boundary/:action', (req, res) => {
    try {
        const { boundary, action } = req.params;
        const data = req.body;
        
        // Dynamic Boundary instantiation
        const BoundaryClass = require(`./boundary/${boundary}`);
        const boundaryInstance = new BoundaryClass();
        
        // Call the appropriate method
        const methodName = `handle${action.charAt(0).toUpperCase() + action.slice(1)}`;
        const result = boundaryInstance[methodName](data);
        
        // Handle response based on result and boundary type
        if (result.success) {
            // Special handling for login - store user in session
            if (boundary.includes('_login') && result.data && result.data.user) {
                req.session.user = result.data.user;
                console.log('✅ Session created for user:', result.data.user.name);
            }
            
            // Special handling for search results - show data instead of redirecting
            if (boundary.includes('searchopportunity') && result.data && result.data.opportunities) {
                res.render('csrrepresentative/search_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    opportunities: result.data.opportunities,
                    success: result.message,
                    error: null
                });
                return;
            }
            
            // Special handling for view opportunity - show opportunity details
            if (boundary.includes('viewopportunity') && result.data && result.data.opportunity) {
                res.render('csrrepresentative/opportunity_details', {
                    user: req.session.user || { name: 'Guest', id: null },
                    opportunity: result.data.opportunity,
                    success: result.message,
                    error: null
                });
                return;
            }
            
            // Success - redirect based on boundary type
            if (boundary.includes('personinneed_login')) {
                res.redirect(`/personinneed/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('csrrepresentative_login')) {
                res.redirect(`/csrrepresentative/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('platformmanager_login')) {
                res.redirect(`/platformmanager/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('useradmin_login')) {
                res.redirect(`/useradmin/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('personinneed')) {
                res.redirect(`/personinneed/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('csrrepresentative')) {
                res.redirect(`/csrrepresentative/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('platformmanager')) {
                res.redirect(`/platformmanager/dashboard?success=${encodeURIComponent(result.message)}`);
            } else if (boundary.includes('useradmin')) {
                res.redirect(`/useradmin/dashboard?success=${encodeURIComponent(result.message)}`);
            } else {
                res.redirect(`/?success=${encodeURIComponent(result.message)}`);
            }
        } else {
            // Error - redirect back to appropriate form
            if (boundary.includes('_login')) {
                res.redirect(`/?error=${encodeURIComponent(result.error)}`);
            } else if (boundary.includes('personinneed')) {
                res.redirect(`/personinneed/dashboard?error=${encodeURIComponent(result.error)}`);
            } else if (boundary.includes('csrrepresentative')) {
                res.redirect(`/csrrepresentative/dashboard?error=${encodeURIComponent(result.error)}`);
            } else if (boundary.includes('platformmanager')) {
                res.redirect(`/platformmanager/dashboard?error=${encodeURIComponent(result.error)}`);
            } else if (boundary.includes('useradmin')) {
                res.redirect(`/useradmin/dashboard?error=${encodeURIComponent(result.error)}`);
            } else {
                res.redirect(`/?error=${encodeURIComponent(result.error)}`);
            }
        }
    } catch (error) {
        console.error('Boundary access error:', error);
        res.redirect(`/?error=${encodeURIComponent('Internal server error')}`);
    }
});

// Simple view routes for Pure BCE Architecture
app.get('/', (req, res) => {
    const success = req.query.success || null;
    res.render('auth/login', { error: null, success: success, user: null });
});

// Simple logout route (no boundary needed - just destroys session)
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/?success=Logged out successfully');
    });
});

app.get('/personinneed/dashboard', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('personinneed/dashboard', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/personinneed/create-request', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('personinneed/create_request', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/csrrepresentative/dashboard', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('csrrepresentative/dashboard', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/csrrepresentative/search-requests', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('csrrepresentative/search_requests', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/platformmanager/dashboard', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('platformmanager/dashboard', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/platformmanager/categories', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('platformmanager/categories', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/platformmanager/reports', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('platformmanager/reports', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/useradmin/dashboard', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('useradmin/dashboard', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/useradmin/accounts', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('useradmin/accounts', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/useradmin/profiles', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('useradmin/profiles', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/personinneed/requests', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('personinneed/requests', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/personinneed/history', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('personinneed/history', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

app.get('/csrrepresentative/shortlist', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('csrrepresentative/shortlist', { 
        user: req.session.user || { name: 'Guest', id: null },
        error: error,
        success: success
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!', 
        error: err,
        user: req.session ? req.session.user : null 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        CSR VOLUNTEERING WEBSITE - SERVER RUNNING       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
 Server running at: http://localhost:${PORT}
 
 PURE BCE ARCHITECTURE - Direct Boundary Access
 Frontend directly calls boundaries without routes
 
 Available Views:
   - http://localhost:${PORT}/                    (Login page)
   - http://localhost:${PORT}/personinneed/dashboard
   - http://localhost:${PORT}/personinneed/create-request
   - http://localhost:${PORT}/csrrepresentative/dashboard
   - http://localhost:${PORT}/csrrepresentative/search-requests
   - http://localhost:${PORT}/platformmanager/dashboard
   - http://localhost:${PORT}/platformmanager/categories
   - http://localhost:${PORT}/useradmin/dashboard
 
 BCE Architecture:
   Frontend → Boundary → Controller → Entity
   (No routes - direct boundary access)
Press Ctrl+C to stop the server
════════════════════════════════════════════════════════════
    `);
});
