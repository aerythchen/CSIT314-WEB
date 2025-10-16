const InMemoryDB = require('./InMemoryDB');
const models = require('./models');
const seedData = require('./seedData');
const { UserProfileHelpers, UserAccountHelpers, CategoryHelpers, RequestHelpers, ShortlistHelpers, SessionHelpers } = require('./helpers');

const db = new InMemoryDB();

// Initialize tables based on models
for (const tableName in models) {
    db.createTable(tableName);
}

// Export the database instance and helpers
module.exports = {
    db: InMemoryDB.getInstance(), // Export the singleton instance
    models,
    seedDatabase: () => seedData(InMemoryDB.getInstance()),
    UserProfileHelpers,
    UserAccountHelpers,
    CategoryHelpers,
    RequestHelpers,
    ShortlistHelpers,
    SessionHelpers
};
