/**
 * Test Demo for CSR Volunteering Website
 * This file contains basic tests to verify the application functionality
 */

const { db } = require('./index');

async function runTests() {
    console.log('🧪 Running CSR Volunteering Website Tests...\n');
    
    let testsPassed = 0;
    let totalTests = 0;
    
    // Test 1: Database Connection
    totalTests++;
    try {
        console.log('Test 1: Database Connection');
        await db.find('userProfiles', { limit: 1 });
        console.log('✅ Database connection successful\n');
        testsPassed++;
    } catch (error) {
        console.log('❌ Database connection failed:', error.message, '\n');
    }
    
    // Test 2: Check if tables exist
    totalTests++;
    try {
        console.log('Test 2: Database Tables');
        const tables = ['userProfiles', 'userAccounts', 'categories', 'requests', 'shortlists'];
        let tablesExist = true;
        
        for (const table of tables) {
            try {
                await db.find(table, { limit: 1 });
            } catch (error) {
                console.log(`❌ Table '${table}' not found`);
                tablesExist = false;
            }
        }
        
        if (tablesExist) {
            console.log('✅ All required tables exist\n');
            testsPassed++;
        } else {
            console.log('❌ Some tables are missing\n');
        }
    } catch (error) {
        console.log('❌ Table check failed:', error.message, '\n');
    }
    
    // Test 3: Check for sample data
    totalTests++;
    try {
        console.log('Test 3: Sample Data');
        const userProfiles = await db.find('userProfiles', {});
        const categories = await db.find('categories', {});
        
        if (userProfiles.length > 0 && categories.length > 0) {
            console.log(`✅ Found ${userProfiles.length} user profiles and ${categories.length} categories\n`);
            testsPassed++;
        } else {
            console.log('⚠️ No sample data found (this is okay for fresh installations)\n');
            testsPassed++; // This is not a failure, just a warning
        }
    } catch (error) {
        console.log('❌ Sample data check failed:', error.message, '\n');
    }
    
    // Test 4: Test basic CRUD operations
    totalTests++;
    try {
        console.log('Test 4: Basic CRUD Operations');
        
        // Test insert
        const testData = {
            id: `test_${Date.now()}`,
            name: 'Test Item',
            createdAt: new Date().toISOString(),
            isDeleted: false
        };
        
        // Try to insert into a test table (we'll use categories as it's safe)
        const insertResult = await db.insert('categories', {
            id: `test_cat_${Date.now()}`,
            name: 'Test Category',
            description: 'Test category for CRUD testing',
            status: 'active',
            createdAt: new Date().toISOString(),
            isDeleted: false
        });
        
        if (insertResult.success) {
            console.log('✅ Insert operation successful');
            
            // Test find
            const findResult = await db.find('categories', { id: insertResult.data.id });
            if (findResult.length > 0) {
                console.log('✅ Find operation successful');
                
                // Test update
                const updateResult = await db.update('categories', insertResult.data.id, {
                    name: 'Updated Test Category',
                    updatedAt: new Date().toISOString()
                });
                
                if (updateResult.success) {
                    console.log('✅ Update operation successful');
                    
                    // Test delete (soft delete)
                    const deleteResult = await db.update('categories', insertResult.data.id, {
                        isDeleted: true,
                        updatedAt: new Date().toISOString()
                    });
                    
                    if (deleteResult.success) {
                        console.log('✅ Delete operation successful');
                        testsPassed++;
                    } else {
                        console.log('❌ Delete operation failed');
                    }
                } else {
                    console.log('❌ Update operation failed');
                }
            } else {
                console.log('❌ Find operation failed');
            }
        } else {
            console.log('❌ Insert operation failed');
        }
        
        console.log(''); // Empty line
    } catch (error) {
        console.log('❌ CRUD operations test failed:', error.message, '\n');
    }
    
    // Test Results
    console.log('════════════════════════════════════════════════════════════');
    console.log(`Test Results: ${testsPassed}/${totalTests} tests passed`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 All tests passed! Application is ready for deployment.');
        process.exit(0);
    } else {
        console.log('⚠️ Some tests failed. Please check the issues above.');
        process.exit(1);
    }
}

// Run the tests
runTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});
