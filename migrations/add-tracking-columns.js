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
        
        // Check if columns already exist
        let existingColumns = [];
        try {
            const checkColumns = await db.executeQuery(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'requests' 
                AND column_name IN ('viewcount', 'shortlistcount')
            `);
            existingColumns = checkColumns.rows ? checkColumns.rows.map(row => row.column_name) : [];
        } catch (error) {
            // If query fails, assume columns don't exist
            console.log('🔍 Checking existing columns...');
        }
        
        if (existingColumns.includes('viewcount') && existingColumns.includes('shortlistcount')) {
            console.log('✅ Tracking columns already exist - skipping migration');
            return;
        }
        
        // Add viewcount column if it doesn't exist
        if (!existingColumns.includes('viewcount')) {
            try {
                console.log('➕ Adding viewcount column...');
                await db.executeQuery(`
                    ALTER TABLE requests 
                    ADD COLUMN viewcount INTEGER DEFAULT 0
                `);
                console.log('✅ viewcount column added');
            } catch (error) {
                if (error.code === '42701') { // Column already exists
                    console.log('✅ viewcount column already exists');
                } else {
                    console.error('❌ Error adding viewcount column:', error.message);
                    throw error;
                }
            }
        }
        
        // Add shortlistcount column if it doesn't exist
        if (!existingColumns.includes('shortlistcount')) {
            try {
                console.log('➕ Adding shortlistcount column...');
                await db.executeQuery(`
                    ALTER TABLE requests 
                    ADD COLUMN shortlistcount INTEGER DEFAULT 0
                `);
                console.log('✅ shortlistcount column added');
            } catch (error) {
                if (error.code === '42701') { // Column already exists
                    console.log('✅ shortlistcount column already exists');
                } else {
                    console.error('❌ Error adding shortlistcount column:', error.message);
                    throw error;
                }
            }
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
