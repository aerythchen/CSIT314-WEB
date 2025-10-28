const seedData = async (db) => {
    console.log('🌱 Seeding database...');
    
    try {
        // Clear existing data first
        console.log('🧹 Clearing existing data...');
        await db.hardDelete('userAccounts', 'account_pin_001');
        await db.hardDelete('userAccounts', 'account_csr_001');
        await db.hardDelete('userAccounts', 'account_pm_001');
        await db.hardDelete('userAccounts', 'account_ua_001');
        await db.hardDelete('userProfiles', 'profile_pin_001');
        await db.hardDelete('userProfiles', 'profile_csr_001');
        await db.hardDelete('userProfiles', 'profile_pm_001');
        await db.hardDelete('userProfiles', 'profile_ua_001');
        
        // User Profiles
        console.log('👤 Creating user profiles...');
        const profile1Result = await db.insert('userProfiles', { 
            id: 'profile_pin_001', 
            firstname: 'Emma', 
            lastname: 'Johnson', 
            email: 'emma.johnson@email.com', 
            usertype: 'personinneed', 
            status: 'active',
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!profile1Result.success) {
            throw new Error(`Failed to create profile1: ${profile1Result.error}`);
        }
        const profile1 = profile1Result.data;
        console.log('✅ Created profile1:', profile1.id);
        
        const profile2Result = await db.insert('userProfiles', { 
            id: 'profile_csr_001', 
            firstname: 'Carol', 
            lastname: 'Williams', 
            email: 'carol.williams@company.com', 
            usertype: 'csrrepresentative', 
            status: 'active',
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!profile2Result.success) {
            throw new Error(`Failed to create profile2: ${profile2Result.error}`);
        }
        const profile2 = profile2Result.data;
        console.log('✅ Created profile2:', profile2.id);
        
        const profile3Result = await db.insert('userProfiles', { 
            id: 'profile_pm_001', 
            firstname: 'Alice', 
            lastname: 'Manager', 
            email: 'alice.manager@csrplatform.com', 
            usertype: 'platformmanager', 
            status: 'active',
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!profile3Result.success) {
            throw new Error(`Failed to create profile3: ${profile3Result.error}`);
        }
        const profile3 = profile3Result.data;
        console.log('✅ Created profile3:', profile3.id);
        
        const profile4Result = await db.insert('userProfiles', { 
            id: 'profile_ua_001', 
            firstname: 'Bob', 
            lastname: 'Admin', 
            email: 'bob.admin@csrplatform.com', 
            usertype: 'useradmin', 
            status: 'active',
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!profile4Result.success) {
            throw new Error(`Failed to create profile4: ${profile4Result.error}`);
        }
        const profile4 = profile4Result.data;
        console.log('✅ Created profile4:', profile4.id);
        
        console.log('✅ Created 4 user profiles');
        
        // User Accounts
        console.log('🔐 Creating user accounts...');
        const account1Result = await db.insert('userAccounts', { 
            id: 'account_pin_001', 
            profileid: profile1.id, 
            username: 'emma_j', 
            passwordhash: 'password123', 
            status: 'active',
            lastlogin: null,
            loginattempts: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!account1Result.success) {
            throw new Error(`Failed to create account1: ${account1Result.error}`);
        }
        console.log('✅ Created account1');
        
        const account2Result = await db.insert('userAccounts', { 
            id: 'account_csr_001', 
            profileid: profile2.id, 
            username: 'carol_w', 
            passwordhash: 'password123', 
            status: 'active',
            lastlogin: null,
            loginattempts: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!account2Result.success) {
            throw new Error(`Failed to create account2: ${account2Result.error}`);
        }
        console.log('✅ Created account2');
        
        const account3Result = await db.insert('userAccounts', { 
            id: 'account_pm_001', 
            profileid: profile3.id, 
            username: 'alice_m', 
            passwordhash: 'password123', 
            status: 'active',
            lastlogin: null,
            loginattempts: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!account3Result.success) {
            throw new Error(`Failed to create account3: ${account3Result.error}`);
        }
        console.log('✅ Created account3');
        
        const account4Result = await db.insert('userAccounts', { 
            id: 'account_ua_001', 
            profileid: profile4.id, 
            username: 'bob_a', 
            passwordhash: 'password123', 
            status: 'active',
            lastlogin: null,
            loginattempts: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!account4Result.success) {
            throw new Error(`Failed to create account4: ${account4Result.error}`);
        }
        console.log('✅ Created account4');
        
        console.log('✅ Created 4 user accounts');
        
        console.log('🎉 Database seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    }
};

module.exports = seedData;
