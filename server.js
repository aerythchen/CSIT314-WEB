const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

const { seedDatabase, db } = require('./database'); // Import db and seedDatabase

// Pure BCE Architecture - No Routes

const app = express();

// Health check endpoint for Docker
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
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
    
    // Create additional test data
    createTestData();
} catch (error) {
    console.error('❌ Failed to initialize or seed database:', error);
    process.exit(1); // Exit if database cannot be initialized
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().none()); // Handle multipart/form-data
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

// GET route for search results page (to handle redirects from save to shortlist)
app.get('/csrrepresentative/search-results', async (req, res) => {
    try {
        const { searchTerm, category, urgency, viewAll, success, error } = req.query;
        
        // Call the search opportunity boundary with the parameters
        const boundary = require('./boundary/csrrepresentative_searchopportunity');
        const boundaryInstance = new boundary();
        
        const result = await boundaryInstance.handleSearchOpportunity({
            userId: req.session.user?.id || 'guest',
            searchTerm: searchTerm || '',
            category: category || '',
            urgency: urgency || '',
            viewAll: viewAll === 'true'
        });
        
        if (result.success) {
            res.render('csrrepresentative/search_results', {
                user: req.session.user || { name: 'Guest', id: null },
                opportunities: result.data.opportunities,
                success: success,
                error: error,
                viewAll: viewAll === 'true' || (!searchTerm && !category && !urgency),
                searchTerm: searchTerm || '',
                category: category || '',
                urgency: urgency || ''
            });
        } else {
            res.render('csrrepresentative/search_results', {
                user: req.session.user || { name: 'Guest', id: null },
                opportunities: [],
                success: null,
                error: result.error || 'Failed to load search results',
                viewAll: viewAll === 'true' || (!searchTerm && !category && !urgency),
                searchTerm: searchTerm || '',
                category: category || '',
                urgency: urgency || ''
            });
        }
    } catch (error) {
        console.error('Search results GET error:', error);
        res.render('csrrepresentative/search_results', {
            user: req.session.user || { name: 'Guest', id: null },
            opportunities: [],
            success: null,
            error: 'Failed to load search results',
            viewAll: true,
            searchTerm: '',
            category: '',
            urgency: ''
        });
    }
});

// GET route for shortlist results page
app.get('/csrrepresentative/shortlist-results', async (req, res) => {
    try {
        const { searchTerm, category, urgency, viewAll, success, error } = req.query;
        
        // If there are search parameters, use search shortlist boundary
        if (searchTerm || category || urgency) {
            const boundary = require('./boundary/csrrepresentative_searchshortlist');
            const boundaryInstance = new boundary();
            
            const result = await boundaryInstance.handleSearchShortlist({
                userId: req.session.user?.id || 'guest',
                searchTerm: searchTerm || '',
                category: category || '',
                urgency: urgency || ''
            });
            
            if (result.success) {
                res.render('csrrepresentative/shortlist_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    shortlistItems: result.data.shortlistItems,
                    success: success,
                    error: error,
                    viewAll: false,
                    searchTerm: searchTerm || '',
                    category: category || '',
                    urgency: urgency || ''
                });
            } else {
                res.render('csrrepresentative/shortlist_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    shortlistItems: [],
                    success: null,
                    error: result.error || 'Failed to search shortlist',
                    viewAll: false,
                    searchTerm: searchTerm || '',
                    category: category || '',
                    urgency: urgency || ''
                });
            }
        } else {
            // No search parameters, show all shortlist items
            const boundary = require('./boundary/csrrepresentative_viewshortlist');
            const boundaryInstance = new boundary();
            
            const result = await boundaryInstance.handleViewShortlist({
                userId: req.session.user?.id || 'guest'
            });
            
            if (result.success) {
                res.render('csrrepresentative/shortlist_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    shortlistItems: result.data.shortlistItems,
                    success: success,
                    error: error,
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: ''
                });
            } else {
                res.render('csrrepresentative/shortlist_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    shortlistItems: [],
                    success: null,
                    error: result.error || 'Failed to load shortlist',
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: ''
                });
            }
        }
    } catch (error) {
        console.error('Shortlist results GET error:', error);
        res.render('csrrepresentative/shortlist_results', {
            user: req.session.user || { name: 'Guest', id: null },
            shortlistItems: [],
            success: null,
            error: 'Failed to load shortlist',
            viewAll: true,
            searchTerm: '',
            category: '',
            urgency: ''
        });
    }
});

// GET route for history results page
app.get('/csrrepresentative/history-results', async (req, res) => {
    try {
        const { searchTerm, category, urgency, status, viewAll, success, error } = req.query;
        
        // If there are search parameters, use search history boundary
        if (searchTerm || category || urgency || status) {
            const boundary = require('./boundary/csrrepresentative_searchhistory');
            const boundaryInstance = new boundary();
            
            const result = await boundaryInstance.handleSearchHistory({
                userId: req.session.user?.id || 'guest',
                searchTerm: searchTerm || '',
                category: category || '',
                urgency: urgency || '',
                status: status || ''
            });
            
            if (result.success) {
                res.render('csrrepresentative/history_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    historyItems: result.data.historyItems,
                    success: success,
                    error: error,
                    viewAll: false,
                    searchTerm: searchTerm || '',
                    category: category || '',
                    urgency: urgency || '',
                    status: status || ''
                });
            } else {
                res.render('csrrepresentative/history_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    historyItems: [],
                    success: null,
                    error: result.error || 'Failed to search history',
                    viewAll: false,
                    searchTerm: searchTerm || '',
                    category: category || '',
                    urgency: urgency || '',
                    status: status || ''
                });
            }
        } else {
            // No search parameters, show all history items
            const boundary = require('./boundary/csrrepresentative_viewhistory');
            const boundaryInstance = new boundary();
            
            const result = await boundaryInstance.handleViewHistory({
                userId: req.session.user?.id || 'guest'
            });
            
            if (result.success) {
                res.render('csrrepresentative/history_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    historyItems: result.data.historyItems,
                    success: success,
                    error: error,
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: '',
                    status: ''
                });
            } else {
                res.render('csrrepresentative/history_results', {
                    user: req.session.user || { name: 'Guest', id: null },
                    historyItems: [],
                    success: null,
                    error: result.error || 'Failed to load history',
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: '',
                    status: ''
                });
            }
        }
    } catch (error) {
        console.error('History results GET error:', error);
        res.render('csrrepresentative/history_results', {
            user: req.session.user || { name: 'Guest', id: null },
            historyItems: [],
            success: null,
            error: 'Failed to load history',
            viewAll: true,
            searchTerm: '',
            category: '',
            urgency: '',
            status: ''
        });
    }
});

// Pure BCE Architecture - Direct Boundary Access via POST
// Single endpoint for all boundary operations

// Single POST endpoint for all BCE operations
app.post('/bce/:boundary/:action', async (req, res) => {
    try {
        const { boundary, action } = req.params;
        const data = req.body;
        
        // Dynamic Boundary instantiation
        const BoundaryClass = require(`./boundary/${boundary}`);
        const boundaryInstance = new BoundaryClass();
        
        // Pass session context to boundary
        data.session = req.session;
        
        // Call the appropriate method
        const methodName = `handle${action.charAt(0).toUpperCase() + action.slice(1)}`;
        const result = await boundaryInstance[methodName](data);
        
        // Handle login session storage
        if (result.success && boundary.includes('_login') && result.data && result.data.user) {
            req.session.user = result.data.user;
            console.log('✅ Session created for user:', result.data.user.name);
        }
        
        // Check if boundary wants to redirect
        if (result.success && result.redirectUrl) {
            res.redirect(result.redirectUrl);
            return;
        }
        
        // Return JSON response
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Boundary access error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Simple view routes for Pure BCE Architecture
app.get('/', (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('auth/login', { error: error, success: success, user: null });
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


// API route to get categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.find('categories', { 
            isDeleted: false, 
            status: 'active' 
        });
        
        res.json({
            success: true,
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// API route to get user requests
app.get('/api/user-requests', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        const boundary = require('./boundary/personinneed_viewrequests');
        const boundaryInstance = new boundary();
        
        const result = await boundaryInstance.handleViewRequests({
            userId: req.session.user.id,
            userType: req.session.user.userType
        });
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user requests'
        });
    }
});

// API route to get completed requests
app.get('/api/completed-requests', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        const boundary = require('./boundary/personinneed_viewhistory');
        const boundaryInstance = new boundary();
        
        const result = await boundaryInstance.handleViewHistory({
            userId: req.session.user.id,
            userType: req.session.user.userType
        });
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching completed requests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch completed requests'
        });
    }
});

// API route to get user statistics
app.get('/api/user-stats', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        // Get user statistics from database (all users are active since we use hard delete)
        const totalUsers = await db.find('userProfiles', {});
        const activeUsers = await db.find('userProfiles', { status: 'active' });
        const adminUsers = await db.find('userProfiles', { usertype: 'useradmin' });
        
        // Calculate new users this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newUsers = await db.find('userProfiles', {
            createdat: { $gte: oneWeekAgo }
        });
        
        res.json({
            success: true,
            stats: {
                totalUsers: totalUsers.length,
                activeUsers: activeUsers.length,
                adminUsers: adminUsers.length,
                newUsers: newUsers.length
            }
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user statistics'
        });
    }
});

// API route to get all users
app.get('/api/all-users', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        // Get all user profiles from database (all users are active since we use hard delete)
        const userProfiles = await db.find('userProfiles', {});
        
        // Get all user accounts from database (all accounts are active since we use hard delete)
        const userAccounts = await db.find('userAccounts', {});
        
        // Combine profile and account data
        const users = userProfiles.map(profile => {
            // Find matching account for this profile
            const account = userAccounts.find(acc => acc.profileid === profile.id);
            
            return {
                id: profile.id,
                name: `${profile.firstname} ${profile.lastname}`,
                email: profile.email,
                userType: profile.usertype,
                status: profile.status || 'active',
                lastActive: profile.updatedat || profile.createdat || new Date().toISOString().split('T')[0],
                accountId: account ? account.id : null,
                username: account ? account.username : null,
                createdAt: profile.createdat,
                updatedAt: profile.updatedat
            };
        });
        
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// API route to search users
app.get('/api/search-users', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        const { searchTerm, userType, status } = req.query;
        
        // Build search conditions (no need to filter soft-deleted since we use hard delete)
        let profileConditions = {};
        let accountConditions = {};
        
        // Add user type filter
        if (userType) {
            profileConditions.usertype = userType;
        }
        
        // Add status filter
        if (status) {
            profileConditions.status = status;
        }
        
        // Get user profiles with conditions
        const userProfiles = await db.find('userProfiles', profileConditions);
        
        // Get all user accounts
        const userAccounts = await db.find('userAccounts', accountConditions);
        
        // Combine profile and account data
        let users = userProfiles.map(profile => {
            const account = userAccounts.find(acc => acc.profileid === profile.id);
            
            return {
                id: profile.id,
                name: `${profile.firstname} ${profile.lastname}`,
                email: profile.email,
                userType: profile.usertype,
                status: profile.status || 'active',
                lastActive: profile.updatedat || profile.createdat || new Date().toISOString().split('T')[0],
                accountId: account ? account.id : null,
                username: account ? account.username : null
            };
        });
        
        // Apply search term filter if provided
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            users = users.filter(user => 
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                (user.username && user.username.toLowerCase().includes(searchLower))
            );
        }
        
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search users'
        });
    }
});

// Route to show edit request form
app.get('/personinneed/edit-request/:requestId', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.redirect('/');
        }
        
        const { requestId } = req.params;
        const { db } = require('./database');
        
        // Get the request details
        const request = await db.findOne('requests', {
            id: requestId,
            createdby: req.session.user.id,
            isdeleted: false
        });
        
        if (!request) {
            return res.status(404).render('error', {
                title: 'Request Not Found',
                message: 'The request you are trying to edit does not exist or you do not have permission to edit it.'
            });
        }
        
        res.render('personinneed/edit_request', {
            title: 'Edit Request',
            user: req.session.user,
            request: request
        });
        
    } catch (error) {
        console.error('Error loading edit request page:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while loading the edit page.'
        });
    }
});

// Route to handle search requests
app.post('/personinneed/search-requests', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.redirect('/');
        }
        
        const { category, status, dateFrom, dateTo } = req.body;
        
        const boundary = require('./boundary/personinneed_searchrequest');
        const boundaryInstance = new boundary();
        
        const result = await boundaryInstance.handleSearchRequest({
            userId: req.session.user.id,
            status: status,
            category: category,
            dateRange: {
                from: dateFrom,
                to: dateTo
            }
        });
        
        if (result.success) {
            res.render('personinneed/dashboard', {
                title: 'Dashboard',
                user: req.session.user,
                searchResults: result.data.requests,
                searchTerm: searchTerm,
                searchStatus: status,
                searchCategory: category
            });
        } else {
            res.render('personinneed/dashboard', {
                title: 'Dashboard',
                user: req.session.user,
                searchError: result.error
            });
        }
        
    } catch (error) {
        console.error('Error searching requests:', error);
        res.render('personinneed/dashboard', {
            title: 'Dashboard',
            user: req.session.user,
            searchError: 'An error occurred while searching requests.'
        });
    }
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
app.listen(PORT, async () => {
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
    
    // Run database migrations on startup
    try {
        console.log('🔄 Running database migrations...');
        const runMigrations = require('./migrations/run-migrations');
        await runMigrations();
        console.log('✅ Database migrations completed\n');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
    
    // Update request status schema on server startup
    await updateRequestStatusSchema();
});

// Function to update request status schema
async function updateRequestStatusSchema() {
    try {
        console.log('🔄 Updating request status schema to 3-status system...');
        
        // First, drop the old constraint to allow data updates
        console.log('🔧 Dropping old constraint...');
        await db.executeQuery(`
            ALTER TABLE requests 
            DROP CONSTRAINT IF EXISTS requests_status_check
        `);
        
        // Update existing data to use new status values
        const approvedRequests = await db.find('requests', { status: 'approved' });
        if (approvedRequests.length > 0) {
            console.log(`Found ${approvedRequests.length} approved requests to update`);
            
            for (const request of approvedRequests) {
                await db.update('requests', request.id, { 
                    status: 'assigned',
                    updatedat: new Date().toISOString()
                });
            }
            console.log('✅ Updated approved requests to assigned status');
        }
        
        // Get all rejected requests and update them to 'pending'
        const rejectedRequests = await db.find('requests', { status: 'rejected' });
        if (rejectedRequests.length > 0) {
            console.log(`Found ${rejectedRequests.length} rejected requests to update`);
            
            for (const request of rejectedRequests) {
                await db.update('requests', request.id, { 
                    status: 'pending',
                    updatedat: new Date().toISOString()
                });
            }
            console.log('✅ Updated rejected requests to pending status');
        }
        
        // Now add the new constraint with the updated data
        console.log('🔧 Adding new constraint...');
        await db.executeQuery(`
            ALTER TABLE requests 
            ADD CONSTRAINT requests_status_check 
            CHECK (status IN ('pending', 'assigned', 'completed'))
        `);
        
        console.log('✅ Database constraint updated successfully!');
        console.log('📊 Request status system updated: pending, assigned, completed');
        
    } catch (error) {
        console.error('❌ Error updating request status schema:', error);
    }
}

// Function to create test data
async function createTestData() {
    try {
        console.log('🔧 Creating test data...');
        
        // Get profiles
        const csrProfile = await db.findOne('userProfiles', {
            userType: 'csrrepresentative',
            status: 'active',
            isDeleted: false
        });
        
        const pinProfile = await db.findOne('userProfiles', {
            userType: 'personinneed',
            status: 'active',
            isDeleted: false
        });
        
        if (!csrProfile || !pinProfile) {
            console.log('⚠️ Profiles not found, skipping test data creation');
            return;
        }
        
        // Get categories
        const categories = await db.find('categories', { isDeleted: false });
        if (categories.length === 0) {
            console.log('⚠️ No categories found, skipping test data creation');
            return;
        }
        
        // Create test requests
        const request1 = {
            id: `req_test_${Date.now()}_1`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[0].id,
            categoryName: categories[0].name,
            title: 'Food assistance for family of 4',
            description: 'Need groceries for a week for my family',
            urgency: 'high',
            status: 'approved',
            viewCount: 5,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };
        
        const request2 = {
            id: `req_test_${Date.now()}_2`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[1] ? categories[1].id : categories[0].id,
            categoryName: categories[1] ? categories[1].name : categories[0].name,
            title: 'Temporary housing needed',
            description: 'Looking for temporary accommodation for 2 weeks',
            urgency: 'critical',
            status: 'pending',
            viewCount: 3,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const request3 = {
            id: `req_test_${Date.now()}_3`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[0].id,
            categoryName: categories[0].name,
            title: 'Medical transportation assistance',
            description: 'Need help getting to hospital appointments twice a week',
            urgency: 'medium',
            status: 'approved',
            viewCount: 2,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const request4 = {
            id: `req_test_${Date.now()}_4`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[1] ? categories[1].id : categories[0].id,
            categoryName: categories[1] ? categories[1].name : categories[0].name,
            title: 'Job search support',
            description: 'Looking for resume help and interview preparation',
            urgency: 'low',
            status: 'pending',
            viewCount: 1,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const request5 = {
            id: `req_test_${Date.now()}_5`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[0].id,
            categoryName: categories[0].name,
            title: 'Childcare assistance',
            description: 'Need help with childcare during work hours',
            urgency: 'high',
            status: 'approved',
            viewCount: 8,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const request6 = {
            id: `req_test_${Date.now()}_6`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[1] ? categories[1].id : categories[0].id,
            categoryName: categories[1] ? categories[1].name : categories[0].name,
            title: 'Educational support',
            description: 'Need tutoring for children in math and science',
            urgency: 'medium',
            status: 'pending',
            viewCount: 4,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };
        
        // Insert requests
        const req1Result = await db.insert('requests', request1);
        const req2Result = await db.insert('requests', request2);
        const req3Result = await db.insert('requests', request3);
        const req4Result = await db.insert('requests', request4);
        const req5Result = await db.insert('requests', request5);
        const req6Result = await db.insert('requests', request6);
        
        if (req1Result.success && req2Result.success && req3Result.success && 
            req4Result.success && req5Result.success && req6Result.success) {
            console.log('✅ Created 6 test requests');
            
            // Create shortlist entries
            const shortlist1 = {
                id: `shortlist_test_${Date.now()}_1`,
                userId: csrProfile.id,
                requestId: request1.id,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDeleted: false
            };
            
            const shortlist2 = {
                id: `shortlist_test_${Date.now()}_2`,
                userId: csrProfile.id,
                requestId: request2.id,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDeleted: false
            };
            
            const shortlist1Result = await db.insert('shortlists', shortlist1);
            const shortlist2Result = await db.insert('shortlists', shortlist2);
            
            if (shortlist1Result.success && shortlist2Result.success) {
                console.log('✅ Created test shortlist entries');
                console.log('🎉 Test data ready! CSR can now test shortlist functionality');
            }
        }
        
    } catch (error) {
        console.error('❌ Error creating test data:', error);
    }
}
