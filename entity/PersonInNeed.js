const { db } = require('../database');
const { RequestHelpers, SessionHelpers } = require('../database/helpers');

/**
 * PersonInNeed Entity - Consolidated entity for all Person in Need operations
 */
class PersonInNeed {
    constructor() {
        this.db = db;
        this.user = null;
        this.session = null;
    }

    // ========================================
    // LOGIN OPERATIONS
    // ========================================
    
    login(email, password) {
        const profile = db.findOne('userProfiles', { 
            email: email, 
            userType: 'personinneed',
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Invalid email or password" };
        }

        // Validate password (in production, this would use bcrypt)
        if (profile.password !== password) {
            return { success: false, error: "Invalid email or password" };
        }

        if (profile.status === 'suspended') {
            return { success: false, error: "Account is suspended" };
        }

        const account = db.findOne('userAccounts', { 
            profileId: profile.id,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Invalid email or password" };
        }

        if (account.status === 'locked') {
            return { success: false, error: "Account is locked" };
        }

        db.update('userAccounts', account.id, {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const sessionResult = SessionHelpers.createSession({
            token: sessionToken,
            accountId: account.id,
            profileId: profile.id,
            userId: profile.id,
            userType: 'personinneed',
            role: 'user',
            status: 'active',
            expiresAt: expiresAt.toISOString()
        });

        if (!sessionResult.success) {
            return sessionResult;
        }

        this.user = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            userType: profile.userType,
            role: 'user',
            permissions: ['create_request', 'view_requests', 'track_activity']
        };

        this.session = sessionResult.data;

        return {
            success: true,
            message: "Login successful",
            data: {
                user: this.user,
                session: this.session
            }
        };
    }

    logout(sessionToken) {
        if (!sessionToken) {
            return { success: false, error: "Session token required" };
        }

        const result = SessionHelpers.deleteSession(sessionToken);
        
        if (result.success) {
            this.user = null;
            this.session = null;
        }

        return result;
    }

    // ========================================
    // REQUEST OPERATIONS
    // ========================================
    
    createRequest(title, description, category, urgency, contact, userId) {
        const result = RequestHelpers.create({
            userId: userId,
            title: title.trim(),
            description: description.trim(),
            category: category,
            urgency: urgency,
            contact: contact,
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        return result;
    }

    viewRequests(userId) {
        const requests = RequestHelpers.findAll({
            createdBy: userId,
            isDeleted: false
        });

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    viewRequest(requestId, userId) {
        const request = RequestHelpers.findOne({ 
            id: requestId,
            createdBy: userId,
            isDeleted: false 
        });

        if (!request) {
            return { success: false, error: "Request not found" };
        }

        return {
            success: true,
            data: request
        };
    }

    updateRequest(requestId, userId, title, description, category, urgency, contact) {
        const request = RequestHelpers.findOne({ 
            id: requestId,
            createdBy: userId,
            isDeleted: false 
        });

        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (category) updateData.category = category;
        if (urgency) updateData.urgency = urgency;
        if (contact) updateData.contact = contact;
        updateData.updatedAt = new Date().toISOString();

        const result = RequestHelpers.update(requestId, updateData);
        return result;
    }

    deleteRequest(requestId, userId) {
        const request = RequestHelpers.findOne({ 
            id: requestId,
            createdBy: userId,
            isDeleted: false 
        });

        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const result = RequestHelpers.delete(requestId);
        return result;
    }

    searchRequests(userId, searchTerm, category, urgency) {
        let requests = RequestHelpers.findAll({
            createdBy: userId,
            isDeleted: false
        });

        if (searchTerm) {
            requests = requests.filter(req =>
                req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category && category !== 'all') {
            requests = requests.filter(req => req.category === category);
        }

        if (urgency && urgency !== 'all') {
            requests = requests.filter(req => req.urgency === urgency);
        }

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    // ========================================
    // TRACKING OPERATIONS
    // ========================================
    
    trackShortlist(requestId) {
        const shortlistEntries = db.findAll('shortlists', {
            requestId: requestId,
            isDeleted: false
        });

        return {
            success: true,
            data: shortlistEntries,
            count: shortlistEntries.length
        };
    }

    trackViews(requestId) {
        // In a real system, we'd track views in a separate table
        // For now, we'll return a placeholder
        return {
            success: true,
            data: { requestId: requestId, views: 0 },
            message: "View tracking feature"
        };
    }

    viewHistory(userId) {
        const requests = RequestHelpers.findAll({
            createdBy: userId,
            isDeleted: false
        });

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    searchHistory(userId, searchTerm, category) {
        let requests = RequestHelpers.findAll({
            createdBy: userId,
            isDeleted: false
        });

        if (searchTerm) {
            requests = requests.filter(req =>
                req.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category && category !== 'all') {
            requests = requests.filter(req => req.category === category);
        }

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }
}

module.exports = PersonInNeed;

