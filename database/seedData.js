const seedData = (db) => {
    console.log('🌱 Seeding database...');
    
    // User Profiles
    const profile1 = db.insert('userProfiles', { id: 'profile_pin_001', firstName: 'Emma', lastName: 'Johnson', email: 'emma.johnson@email.com', userType: 'personinneed', status: 'active' }).data;
    const profile2 = db.insert('userProfiles', { id: 'profile_csr_001', firstName: 'Carol', lastName: 'Williams', email: 'carol.williams@company.com', userType: 'csrrepresentative', status: 'active' }).data;
    const profile3 = db.insert('userProfiles', { id: 'profile_pm_001', firstName: 'Alice', lastName: 'Manager', email: 'alice.manager@csrplatform.com', userType: 'platformmanager', status: 'active' }).data;
    const profile4 = db.insert('userProfiles', { id: 'profile_ua_001', firstName: 'Bob', lastName: 'Admin', email: 'bob.admin@csrplatform.com', userType: 'useradmin', status: 'active' }).data;
    const profile5 = db.insert('userProfiles', { id: 'profile_pin_002', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', userType: 'personinneed', status: 'active' }).data;
    const profile6 = db.insert('userProfiles', { id: 'profile_csr_002', firstName: 'David', lastName: 'Brown', email: 'david.brown@company.com', userType: 'csrrepresentative', status: 'active' }).data;
    const profile7 = db.insert('userProfiles', { id: 'profile_pin_003', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@email.com', userType: 'personinneed', status: 'active' }).data;
    
    console.log('✓ Created 7 user profiles');
    
    // User Accounts
    const account1 = db.insert('userAccounts', { id: 'account_pin_001', profileId: profile1.id, username: 'emma_j', passwordHash: 'hashed_password_1', status: 'active' }).data;
    const account2 = db.insert('userAccounts', { id: 'account_csr_001', profileId: profile2.id, username: 'carol_w', passwordHash: 'hashed_password_2', status: 'active' }).data;
    const account3 = db.insert('userAccounts', { id: 'account_pm_001', profileId: profile3.id, username: 'alice_m', passwordHash: 'hashed_password_3', status: 'active' }).data;
    const account4 = db.insert('userAccounts', { id: 'account_ua_001', profileId: profile4.id, username: 'bob_a', passwordHash: 'hashed_password_4', status: 'active' }).data;
    const account5 = db.insert('userAccounts', { id: 'account_pin_002', profileId: profile5.id, username: 'john_s', passwordHash: 'hashed_password_5', status: 'active' }).data;
    const account6 = db.insert('userAccounts', { id: 'account_csr_002', profileId: profile6.id, username: 'david_b', passwordHash: 'hashed_password_6', status: 'active' }).data;
    const account7 = db.insert('userAccounts', { id: 'account_pin_003', profileId: profile7.id, username: 'sarah_d', passwordHash: 'hashed_password_7', status: 'active' }).data;
    
    console.log('✓ Created 7 user accounts');
    
    // Categories
    const category1 = db.insert('categories', { id: 'cat_001', name: 'Food Assistance', description: 'Support for food-related needs', status: 'active' }).data;
    const category2 = db.insert('categories', { id: 'cat_002', name: 'Housing Support', description: 'Help with housing and shelter', status: 'active' }).data;
    const category3 = db.insert('categories', { id: 'cat_003', name: 'Medical Aid', description: 'Medical and healthcare assistance', status: 'active' }).data;
    const category4 = db.insert('categories', { id: 'cat_004', name: 'Education', description: 'Educational support and resources', status: 'active' }).data;
    const category5 = db.insert('categories', { id: 'cat_005', name: 'Emergency Relief', description: 'Emergency and disaster relief', status: 'active' }).data;
    
    console.log('✓ Created 5 categories');
    
    // Requests
    const request1 = db.insert('requests', { id: 'req_001', createdBy: profile1.id, createdByName: `${profile1.firstName} ${profile1.lastName}`, categoryId: category1.id, categoryName: category1.name, title: 'Food assistance for family of 4', description: 'Need groceries for a week', urgency: 'high', status: 'approved', viewCount: 5, shortlistCount: 2 }).data;
    const request2 = db.insert('requests', { id: 'req_002', createdBy: profile5.id, createdByName: `${profile5.firstName} ${profile5.lastName}`, categoryId: category2.id, categoryName: category2.name, title: 'Temporary housing needed', description: 'Looking for temporary accommodation', urgency: 'critical', status: 'pending', viewCount: 3, shortlistCount: 1 }).data;
    const request3 = db.insert('requests', { id: 'req_003', createdBy: profile7.id, createdByName: `${profile7.firstName} ${profile7.lastName}`, categoryId: category3.id, categoryName: category3.name, title: 'Medical supplies for elderly', description: 'Need medical supplies for elderly parent', urgency: 'medium', status: 'approved', viewCount: 2, shortlistCount: 0 }).data;
    const request4 = db.insert('requests', { id: 'req_004', createdBy: profile1.id, createdByName: `${profile1.firstName} ${profile1.lastName}`, categoryId: category4.id, categoryName: category4.name, title: 'School supplies for children', description: 'Need school supplies for two children', urgency: 'low', status: 'pending', viewCount: 1, shortlistCount: 1 }).data;
    
    console.log('✓ Created 4 requests');
    
    // Shortlists
    db.insert('shortlists', { id: 'sl_001', userId: profile2.id, requestId: request1.id, isActive: true }).data;
    db.insert('shortlists', { id: 'sl_002', userId: profile6.id, requestId: request1.id, isActive: true }).data;
    db.insert('shortlists', { id: 'sl_003', userId: profile2.id, requestId: request2.id, isActive: true }).data;
    
    console.log('✓ Created 3 shortlist entries');
    
    // Update category counts
    db.update('categories', category1.id, { requestCount: db.find('requests', { categoryId: category1.id }).length });
    db.update('categories', category2.id, { requestCount: db.find('requests', { categoryId: category2.id }).length });
    db.update('categories', category3.id, { requestCount: db.find('requests', { categoryId: category3.id }).length });
    db.update('categories', category4.id, { requestCount: db.find('requests', { categoryId: category4.id }).length });
    db.update('categories', category5.id, { requestCount: db.find('requests', { categoryId: category5.id }).length });
    
    console.log('✓ Updated category counts');
    console.log('🎉 Database seeded successfully!');
    
    // Log statistics
    console.log('📊 Statistics:', {
        userProfiles: db.count('userProfiles', { isDeleted: false }),
        userAccounts: db.count('userAccounts', { isDeleted: false }),
        categories: db.count('categories', { isDeleted: false }),
        requests: db.count('requests', { isDeleted: false }),
        shortlists: db.count('shortlists', { isDeleted: false })
    });
};

module.exports = seedData;
