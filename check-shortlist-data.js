/**
 * Check shortlist data in database
 */

const { db } = require('./database');

async function checkShortlistData() {
    console.log('🔍 Checking shortlist data...\n');
    
    try {
        // Check shortlists
        const shortlists = await db.find('shortlists', { isDeleted: false });
        console.log(`📋 Found ${shortlists.length} shortlist entries`);
        
        if (shortlists.length > 0) {
            console.log('Shortlist entries:');
            shortlists.forEach((shortlist, index) => {
                console.log(`  ${index + 1}. ID: ${shortlist.id}`);
                console.log(`     User: ${shortlist.userId}`);
                console.log(`     Request: ${shortlist.requestId}`);
                console.log(`     Active: ${shortlist.isActive}`);
                console.log('');
            });
        } else {
            console.log('❌ No shortlist entries found');
        }
        
        // Check requests
        const requests = await db.find('requests', { isDeleted: false });
        console.log(`📝 Found ${requests.length} request entries`);
        
        if (requests.length > 0) {
            console.log('Request entries:');
            requests.forEach((request, index) => {
                console.log(`  ${index + 1}. ID: ${request.id}`);
                console.log(`     Title: ${request.title}`);
                console.log(`     Created by: ${request.createdBy}`);
                console.log('');
            });
        }
        
        // Check CSR profile
        const csrProfile = await db.findOne('userProfiles', {
            userType: 'csrrepresentative',
            status: 'active',
            isDeleted: false
        });
        
        if (csrProfile) {
            console.log(`👤 CSR Profile: ${csrProfile.id}`);
        } else {
            console.log('❌ CSR profile not found');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkShortlistData();
