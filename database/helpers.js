const { db } = require('./index');

const UserProfileHelpers = {
    findAll: (filters) => db.find('userProfiles', filters),
    findOne: (filters) => db.findOne('userProfiles', filters),
    findCSRRepresentatives: () => db.find('userProfiles', { userType: 'csrrepresentative', isDeleted: false }),
    findProfileByEmail: (email) => db.findOne('userProfiles', { email: email, isDeleted: false }),
    findProfileById: (id) => db.findById('userProfiles', id),
    findProfilesByType: (userType) => db.find('userProfiles', { userType: userType, isDeleted: false }),
    searchProfiles: (searchTerm) => db.searchMultipleFields('userProfiles', searchTerm, ['firstName', 'lastName', 'email']),
    create: (profileData) => db.insert('userProfiles', profileData),
    createProfile: (profileData) => db.insert('userProfiles', profileData),
    update: (id, updateData) => db.update('userProfiles', id, updateData),
    updateProfile: (id, updateData) => db.update('userProfiles', id, updateData),
    suspendProfile: (id) => db.update('userProfiles', id, { status: 'suspended' })
};

const UserAccountHelpers = {
    findAll: (filters) => db.find('userAccounts', filters),
    findOne: (filters) => db.findOne('userAccounts', filters),
    findAccountByUsername: (username) => db.findOne('userAccounts', { username: username, isDeleted: false }),
    findAccountById: (id) => db.findById('userAccounts', id),
    findAccountsByProfileId: (profileId) => db.find('userAccounts', { profileId: profileId, isDeleted: false }),
    create: (accountData) => db.insert('userAccounts', accountData),
    createAccount: (accountData) => db.insert('userAccounts', accountData),
    update: (id, updateData) => db.update('userAccounts', id, updateData),
    updateAccount: (id, updateData) => db.update('userAccounts', id, updateData),
    suspendAccount: (id) => db.update('userAccounts', id, { status: 'suspended' })
};

const CategoryHelpers = {
    findAll: (filters) => db.find('categories', filters),
    findOne: (filters) => db.findOne('categories', filters),
    findActiveCategories: () => db.find('categories', { status: 'active', isDeleted: false }),
    findCategoryById: (id) => db.findById('categories', id),
    create: (categoryData) => db.insert('categories', categoryData),
    createCategory: (categoryData) => db.insert('categories', categoryData),
    update: (id, updateData) => db.update('categories', id, updateData),
    updateCategory: (id, updateData) => db.update('categories', id, updateData),
    delete: (id) => db.softDelete('categories', id),
    deleteCategory: (id) => db.softDelete('categories', id)
};

const RequestHelpers = {
    findAll: (filters) => db.find('requests', filters),
    findOne: (filters) => db.findOne('requests', filters),
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
    create: (requestData) => db.insert('requests', requestData),
    createRequest: (requestData) => db.insert('requests', requestData),
    update: (id, updateData) => db.update('requests', id, updateData),
    updateRequest: (id, updateData) => db.update('requests', id, updateData),
    delete: (id) => db.softDelete('requests', id),
    deleteRequest: (id) => db.softDelete('requests', id)
};

const ShortlistHelpers = {
    findAll: (filters) => db.find('shortlists', filters),
    findOne: (filters) => db.findOne('shortlists', filters),
    findShortlistsByUser: (userId) => db.find('shortlists', { userId: userId, isActive: true, isDeleted: false }),
    findShortlistsByRequest: (requestId) => db.find('shortlists', { requestId: requestId, isActive: true, isDeleted: false }),
    create: (shortlistData) => db.insert('shortlists', shortlistData),
    addToShortlist: (shortlistData) => db.insert('shortlists', shortlistData),
    delete: (id) => db.softDelete('shortlists', id),
    removeFromShortlist: (id) => db.update('shortlists', id, { isActive: false })
};

const SessionHelpers = {
    findAll: (filters) => db.find('sessions', filters),
    findOne: (filters) => db.findOne('sessions', filters),
    createSession: (sessionData) => db.insert('sessions', sessionData),
    findActiveSession: (token) => db.findOne('sessions', { token: token, isActive: true, isDeleted: false }),
    deleteSession: (token) => {
        const session = db.findOne('sessions', { token: token });
        if (session) {
            return db.softDelete('sessions', session.id);
        }
        return { success: false, error: 'Session not found' };
    },
    deactivateSession: (token) => db.update('sessions', token, { isActive: false }),
    countActiveSessions: () => db.count('sessions', { isActive: true, isDeleted: false })
};

const MatchHelpers = {
    findAll: (filters) => db.find('matches', filters),
    findOne: (filters) => db.findOne('matches', filters),
    findMatchesByCSR: (csrId) => db.find('matches', { csrId: csrId, isDeleted: false }),
    findMatchesByRequest: (requestId) => db.find('matches', { requestId: requestId, isDeleted: false }),
    findCompletedMatches: () => db.find('matches', { status: 'completed', isDeleted: false }),
    create: (matchData) => db.insert('matches', matchData),
    update: (id, updateData) => db.update('matches', id, updateData),
    delete: (id) => db.softDelete('matches', id)
};

module.exports = {
    UserProfileHelpers,
    UserAccountHelpers,
    CategoryHelpers,
    RequestHelpers,
    ShortlistHelpers,
    SessionHelpers,
    MatchHelpers
};
