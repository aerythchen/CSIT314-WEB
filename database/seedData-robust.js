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
        
        // Categories
        console.log('📂 Creating categories...');
        const category1Result = await db.insert('categories', {
            id: 'cat_education_001',
            name: 'Education',
            description: 'Educational support and tutoring services',
            status: 'active',
            requestcount: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!category1Result.success) {
            throw new Error(`Failed to create category1: ${category1Result.error}`);
        }
        console.log('✅ Created category1: Education');
        
        const category2Result = await db.insert('categories', {
            id: 'cat_health_001',
            name: 'Healthcare',
            description: 'Medical and health-related assistance',
            status: 'active',
            requestcount: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!category2Result.success) {
            throw new Error(`Failed to create category2: ${category2Result.error}`);
        }
        console.log('✅ Created category2: Healthcare');
        
        const category3Result = await db.insert('categories', {
            id: 'cat_food_001',
            name: 'Food Assistance',
            description: 'Food and meal support services',
            status: 'active',
            requestcount: 0,
            createdat: new Date().toISOString(),
            updatedat: null,
            isdeleted: false
        });
        
        if (!category3Result.success) {
            throw new Error(`Failed to create category3: ${category3Result.error}`);
        }
        console.log('✅ Created category3: Food Assistance');
        
        // Requests with test data
        console.log('📝 Creating test requests...');
        
        // Request 1 - Pending (with view/shortlist counts)
        const request1Result = await db.insert('requests', {
            id: 'req_001',
            createdby: profile1.id,
            createdbyname: `${profile1.firstname} ${profile1.lastname}`,
            categoryid: category1Result.data.id,
            categoryname: 'Education',
            title: 'Math Tutoring Needed',
            description: 'I need help with calculus and algebra for my university course. Looking for someone who can explain complex mathematical concepts clearly.',
            urgency: 'medium',
            status: 'pending',
            viewcount: Math.floor(Math.random() * 50) + 1, // 1-50 views
            shortlistcount: Math.floor(Math.random() * 10) + 1, // 1-10 shortlists
            createdat: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            updatedat: null,
            isdeleted: false
        });
        
        if (!request1Result.success) {
            throw new Error(`Failed to create request1: ${request1Result.error}`);
        }
        console.log('✅ Created request1: Math Tutoring (Pending)');
        
        // Request 2 - Assigned (with view/shortlist counts)
        const request2Result = await db.insert('requests', {
            id: 'req_002',
            createdby: profile1.id,
            createdbyname: `${profile1.firstname} ${profile1.lastname}`,
            categoryid: category2Result.data.id,
            categoryname: 'Healthcare',
            title: 'Medical Appointment Assistance',
            description: 'I need help getting to my doctor appointments. Looking for someone who can provide transportation and accompany me.',
            urgency: 'high',
            status: 'assigned',
            viewcount: Math.floor(Math.random() * 50) + 1,
            shortlistcount: Math.floor(Math.random() * 10) + 1,
            createdat: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            updatedat: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            isdeleted: false
        });
        
        if (!request2Result.success) {
            throw new Error(`Failed to create request2: ${request2Result.error}`);
        }
        console.log('✅ Created request2: Medical Appointment (Assigned)');
        
        // Request 3 - Completed (with view/shortlist counts)
        const request3Result = await db.insert('requests', {
            id: 'req_003',
            createdby: profile1.id,
            createdbyname: `${profile1.firstname} ${profile1.lastname}`,
            categoryid: category3Result.data.id,
            categoryname: 'Food Assistance',
            title: 'Grocery Shopping Help',
            description: 'I need assistance with grocery shopping due to mobility issues. Looking for someone to help me shop for essentials.',
            urgency: 'low',
            status: 'completed',
            viewcount: Math.floor(Math.random() * 50) + 1,
            shortlistcount: Math.floor(Math.random() * 10) + 1,
            createdat: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            updatedat: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            isdeleted: false
        });
        
        if (!request3Result.success) {
            throw new Error(`Failed to create request3: ${request3Result.error}`);
        }
        console.log('✅ Created request3: Grocery Shopping (Completed)');
        
        // Request 4 - Completed (with view/shortlist counts)
        const request4Result = await db.insert('requests', {
            id: 'req_004',
            createdby: profile1.id,
            createdbyname: `${profile1.firstname} ${profile1.lastname}`,
            categoryid: category1Result.data.id,
            categoryname: 'Education',
            title: 'English Language Learning',
            description: 'I need help improving my English speaking and writing skills. Looking for a patient tutor who can work with me weekly.',
            urgency: 'medium',
            status: 'completed',
            viewcount: Math.floor(Math.random() * 50) + 1,
            shortlistcount: Math.floor(Math.random() * 10) + 1,
            createdat: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            updatedat: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            isdeleted: false
        });
        
        if (!request4Result.success) {
            throw new Error(`Failed to create request4: ${request4Result.error}`);
        }
        console.log('✅ Created request4: English Learning (Completed)');
        
        // Request 5 - Pending (with view/shortlist counts)
        const request5Result = await db.insert('requests', {
            id: 'req_005',
            createdby: profile1.id,
            createdbyname: `${profile1.firstname} ${profile1.lastname}`,
            categoryid: category2Result.data.id,
            categoryname: 'Healthcare',
            title: 'Mental Health Support',
            description: 'I am looking for someone to talk to about my mental health struggles. Need a compassionate listener who can provide emotional support.',
            urgency: 'critical',
            status: 'pending',
            viewcount: Math.floor(Math.random() * 50) + 1,
            shortlistcount: Math.floor(Math.random() * 10) + 1,
            createdat: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            updatedat: null,
            isdeleted: false
        });
        
        if (!request5Result.success) {
            throw new Error(`Failed to create request5: ${request5Result.error}`);
        }
        console.log('✅ Created request5: Mental Health Support (Pending)');
        
        console.log('🎉 Database seeding completed successfully!');
        console.log('📊 Test data includes:');
        console.log('   - 3 Categories (Education, Healthcare, Food Assistance)');
        console.log('   - 5 Requests with random view/shortlist counts');
        console.log('   - 2 Completed requests for testing completed matches');
        console.log('   - 2 Pending requests for testing regular functionality');
        console.log('   - 1 Assigned request for testing different statuses');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    }
};

module.exports = seedData;
