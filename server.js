const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { seedDatabase, db } = require('./database'); // Import db and seedDatabase

// Import routes
const authRoutes = require('./routes/auth');
const personInNeedRoutes = require('./routes/personinneed');
const csrRepresentativeRoutes = require('./routes/csrrepresentative');
const platformManagerRoutes = require('./routes/platformmanager');
const userAdminRoutes = require('./routes/useradmin');

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

// Use routes
app.use('/auth', authRoutes);
app.use('/personinneed', personInNeedRoutes);
app.use('/csrrepresentative', csrRepresentativeRoutes);
app.use('/platformmanager', platformManagerRoutes);
app.use('/useradmin', userAdminRoutes);

// Home route
app.get('/', (req, res) => {
    if (req.session.user) {
        // Redirect to appropriate dashboard if logged in
        return res.redirect(`/${req.session.user.userType}/dashboard`);
    }
    res.redirect('/auth/login');
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
║       🌟 CSR VOLUNTEERING WEBSITE - SERVER RUNNING 🌟      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
📡 Server running at: http://localhost:${PORT}
🌐 Open your browser and navigate to the URL above
📊 Available routes:
   - http://localhost:${PORT}/auth/login          (Login page)
   - http://localhost:${PORT}/useradmin/dashboard (User Admin)
   - http://localhost:${PORT}/platformmanager/dashboard
   - http://localhost:${PORT}/csrrepresentative/dashboard
   - http://localhost:${PORT}/personinneed/dashboard
🔐 Test Accounts:
   User Admin:    bob.admin@csrplatform.com / password123
   Platform Mgr:  alice.manager@csrplatform.com / password123
   CSR Rep:       carol.williams@company.com / password123
   Person in Need: emma.johnson@email.com / password123
Press Ctrl+C to stop the server
════════════════════════════════════════════════════════════
    `);
});
