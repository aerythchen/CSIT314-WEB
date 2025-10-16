const db = require('./InMemoryDB').getInstance();

const UserProfileHelpers = {
    findCSRRepresentatives: () => db.find('userProfiles', { userType: 'csrrepresentative', isDeleted: false }),
    findProfileByEmail: (email) => db.findOne('userProfiles', { email: email, isDeleted: false }),
    findProfileById: (id) => db.findById('userProfiles', id),
    findProfilesByType: (userType) => db.find('userProfiles', { userType: userType, isDeleted: false }),
    searchProfiles: (searchTerm) => db.searchMultipleFields('userProfiles', searchTerm, ['firstName', 'lastName', 'email']),
    createProfile: (profileData) => db.insert('userProfiles', profileData),
    updateProfile: (id, updateData) => db.update('userProfiles', id, updateData),
    suspendProfile: (id) => db.update('userProfiles', id, { status: 'suspended' })
};

const UserAccountHelpers = {
    findAccountByUsername: (username) => db.findOne('userAccounts', { username: username, isDeleted: false }),
    findAccountById: (id) => db.findById('userAccounts', id),
    findAccountsByProfileId: (profileId) => db.find('userAccounts', { profileId: profileId, isDeleted: false }),
    createAccount: (accountData) => db.insert('userAccounts', accountData),
    updateAccount: (id, updateData) => db.update('userAccounts', id, updateData),
    suspendAccount: (id) => db.update('userAccounts', id, { status: 'suspended' })
};

const CategoryHelpers = {
    findActiveCategories: () => db.find('categories', { status: 'active', isDeleted: false }),
    findCategoryById: (id) => db.findById('categories', id),
    createCategory: (categoryData) => db.insert('categories', categoryData),
    updateCategory: (id, updateData) => db.update('categories', id, updateData),
    deleteCategory: (id) => db.softDelete('categories', id)
};

const RequestHelpers = {
    findRequestsByCategory: (categoryId) => db.find('requests', { categoryId: categoryId, isDeleted: false }),
    findRequestsByUser: (userId) => db.find('requests', { createdBy: userId, isDeleted: false }),
    findRequestsByDateRange: (startDate, endDate) => {
        const requests = db.find('requests', { isDeleted: false });
        return requests.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate >= new Date(startDate) && reqDate <= new Date(endDate);
        });
    },
    findRequestById: (id) => db.findById('requests', id),
    createRequest: (requestData) => db.insert('requests', requestData),
    updateRequest: (id, updateData) => db.update('requests', id, updateData),
    deleteRequest: (id) => db.softDelete('requests', id)
};

const ShortlistHelpers = {
    findShortlistsByUser: (userId) => db.find('shortlists', { userId: userId, isActive: true, isDeleted: false }),
    findShortlistsByRequest: (requestId) => db.find('shortlists', { requestId: requestId, isActive: true, isDeleted: false }),
    addToShortlist: (shortlistData) => db.insert('shortlists', shortlistData),
    removeFromShortlist: (id) => db.update('shortlists', id, { isActive: false })
};

const SessionHelpers = {
    createSession: (sessionData) => db.insert('sessions', sessionData),
    findActiveSession: (token) => db.findOne('sessions', { token: token, isActive: true, isDeleted: false }),
    deactivateSession: (token) => db.update('sessions', token, { isActive: false }),
    countActiveSessions: () => db.count('sessions', { isActive: true, isDeleted: false })
};

module.exports = {
    UserProfileHelpers,
    UserAccountHelpers,
    CategoryHelpers,
    RequestHelpers,
    ShortlistHelpers,
    SessionHelpers
};
