/**
 * Add test data - 2 requests and 2 shortlist entries
 */

const { db } = require('./database');

async function addTestData() {
    console.log('🔧 Adding test data...\n');
    
    try {
        // Get CSR profile
        const csrProfile = await db.findOne('userProfiles', {
            userType: 'csrrepresentative',
            status: 'active',
            isDeleted: false
        });
        
        if (!csrProfile) {
            console.log('❌ CSR profile not found');
            return;
        }
        
        // Get Person in Need profile
        const pinProfile = await db.findOne('userProfiles', {
            userType: 'personinneed',
            status: 'active',
            isDeleted: false
        });
        
        if (!pinProfile) {
            console.log('❌ Person in Need profile not found');
            return;
        }
        
        // Get categories
        const categories = await db.find('categories', { isDeleted: false });
        if (categories.length === 0) {
            console.log('❌ No categories found');
            return;
        }
        
        console.log('✅ Found profiles and categories');
        
        // Create 2 test requests
        const request1 = {
            id: `req_test_${Date.now()}_1`,
            createdBy: pinProfile.id,
            createdByName: 'Emma Johnson',
            categoryId: categories[0].id,
            categoryName: categories[0].name,
            title: 'Food assistance for family of 4',
            description: 'Need groceries for a week for my family',
            urgency: 'high',
            status: 'assigned',
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
        
        // Insert requests
        console.log('📝 Creating requests...');
        const req1Result = await db.insert('requests', request1);
        const req2Result = await db.insert('requests', request2);
        
        if (req1Result.success && req2Result.success) {
            console.log('✅ Created 2 test requests');
            
            // Create 2 shortlist entries
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
            
            console.log('📋 Creating shortlist entries...');
            const shortlist1Result = await db.insert('shortlists', shortlist1);
            const shortlist2Result = await db.insert('shortlists', shortlist2);
            
            if (shortlist1Result.success && shortlist2Result.success) {
                console.log('✅ Created 2 shortlist entries');
                console.log('🎉 Test data ready!');
                console.log(`   - CSR Profile: ${csrProfile.id}`);
                console.log(`   - Request 1: ${request1.id}`);
                console.log(`   - Request 2: ${request2.id}`);
                console.log(`   - Shortlist 1: ${shortlist1.id}`);
                console.log(`   - Shortlist 2: ${shortlist2.id}`);
            } else {
                console.log('❌ Failed to create shortlist entries');
            }
        } else {
            console.log('❌ Failed to create requests');
        }
        
    } catch (error) {
        console.error('❌ Error adding test data:', error);
    }
}

addTestData();
