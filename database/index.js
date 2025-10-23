const PostgreSQLDB = require('./PostgreSQLDB');
const models = require('./models');
const seedData = require('./seedData-robust');
const { UserProfileHelpers, UserAccountHelpers, CategoryHelpers, RequestHelpers, ShortlistHelpers, SessionHelpers, MatchHelpers } = require('./helpers');

const db = PostgreSQLDB.getInstance();

// Test database connection
db.testConnection().then(success => {
    if (success) {
        console.log('✅ PostgreSQL database connected successfully!');
    } else {
        console.error('❌ Failed to connect to PostgreSQL database');
        process.exit(1);
    }
});

// Export the database instance and helpers
module.exports = {
    db: db, // Export the PostgreSQL instance
    models,
    seedDatabase: () => seedData(db),
    UserProfileHelpers,
    UserAccountHelpers,
    CategoryHelpers,
    RequestHelpers,
    ShortlistHelpers,
    SessionHelpers,
    MatchHelpers
};
