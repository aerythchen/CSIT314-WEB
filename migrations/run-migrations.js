const addTrackingColumns = require('./add-tracking-columns');

/**
 * Master migration runner
 * Runs all pending migrations in order
 */
async function runAllMigrations() {
    console.log('🚀 Starting database migrations...\n');
    
    try {
        // Migration 1: Add tracking columns
        console.log('📋 Running migration: Add tracking columns');
        await addTrackingColumns();
        console.log('✅ Migration 1 completed\n');
        
        console.log('🎉 All migrations completed successfully!');
        console.log('📊 Database is now up to date');
        
    } catch (error) {
        console.error('💥 Migration failed:', error);
        throw error;
    }
}

// Run migrations if called directly
if (require.main === module) {
    runAllMigrations()
        .then(() => {
            console.log('🏁 Migration process completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Migration process failed:', error);
            process.exit(1);
        });
}

module.exports = runAllMigrations;
