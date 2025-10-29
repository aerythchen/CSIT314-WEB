const PostgreSQLDB = require('../database/PostgreSQLDB');

/**
 * Migration: Add tracking columns to requests table
 * This script adds viewcount and shortlistcount columns to the requests table
 * Run this on any new environment or fresh database setup
 */
async function addTrackingColumns() {
    const db = PostgreSQLDB.getInstance();
    
    try {
        console.log('🔄 Starting migration: Add tracking columns to requests table...');
        
        // Try to add columns - if they already exist, the error will be caught and handled
        
        // Add viewcount column if it doesn't exist
        console.log('➕ Adding viewcount column...');
        const viewcountResult = await db.executeQuery(`
            ALTER TABLE requests 
            ADD COLUMN viewcount INTEGER DEFAULT 0
        `);
        
        if (viewcountResult.success) {
            console.log('✅ viewcount column added');
        } else if (viewcountResult.error && viewcountResult.error.includes('already exists')) {
            console.log('✅ viewcount column already exists - skipping');
        } else {
            console.error('❌ Error adding viewcount column:', viewcountResult.error);
            throw new Error(viewcountResult.error);
        }
        
        // Add shortlistcount column if it doesn't exist
        console.log('➕ Adding shortlistcount column...');
        const shortlistcountResult = await db.executeQuery(`
            ALTER TABLE requests 
            ADD COLUMN shortlistcount INTEGER DEFAULT 0
        `);
        
        if (shortlistcountResult.success) {
            console.log('✅ shortlistcount column added');
        } else if (shortlistcountResult.error && shortlistcountResult.error.includes('already exists')) {
            console.log('✅ shortlistcount column already exists - skipping');
        } else {
            console.error('❌ Error adding shortlistcount column:', shortlistcountResult.error);
            throw new Error(shortlistcountResult.error);
        }
        
        // Update existing records to have default values
        console.log('🔄 Updating existing records...');
        await db.executeQuery(`
            UPDATE requests 
            SET viewcount = 0, shortlistcount = 0 
            WHERE viewcount IS NULL OR shortlistcount IS NULL
        `);
        
        console.log('✅ Migration completed successfully!');
        console.log('   📊 Added columns:');
        console.log('      - viewcount: INTEGER DEFAULT 0');
        console.log('      - shortlistcount: INTEGER DEFAULT 0');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    addTrackingColumns()
        .then(() => {
            console.log('🎉 Migration script completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Migration script failed:', error);
            process.exit(1);
        });
}

module.exports = addTrackingColumns;
