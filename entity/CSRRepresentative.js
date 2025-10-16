const { db } = require('../database');
const { RequestHelpers, ShortlistHelpers, SessionHelpers, MatchHelpers } = require('../database/helpers');

/**
 * CSRRepresentative Entity - Consolidated entity for all CSR Representative operations
 * Similar to buyer.class.php in reference project
 */
class CSRRepresentative {
    constructor() {
        this.db = db;
        this.user = null;
        this.session = null;
    }

    // ========================================
    // LOGIN OPERATIONS
    // ========================================
    
    login(email, password) {
        // Find user profile by email
        const profile = db.findOne('userProfiles', { 
            email: email, 
            userType: 'csrrepresentative',
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Invalid email or password" };
        }

        // Validate password (in production, this would use bcrypt)
        if (profile.password !== password) {
            return { success: false, error: "Invalid email or password" };
        }

        // Check if profile is suspended
        if (profile.status === 'suspended') {
            return { success: false, error: "Account is suspended" };
        }

        // Find associated account
        const account = db.findOne('userAccounts', { 
            profileId: profile.id,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Invalid email or password" };
        }

        // Check if account is locked
        if (account.status === 'locked') {
            return { success: false, error: "Account is locked" };
        }

        // Update last login
        db.update('userAccounts', account.id, {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        });

        // Create session
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const sessionData = {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token: sessionToken,
            userId: profile.id,
            expiresAt: expiresAt.toISOString(),
            isActive: true
        };

        const sessionResult = SessionHelpers.createSession(sessionData);

        if (!sessionResult.success) {
            return { success: false, error: "Failed to create session" };
        }

        // Store user data
        this.user = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            userType: profile.userType,
            role: 'representative',
            permissions: ['search_requests', 'view_requests', 'manage_shortlist']
        };

        this.session = sessionData;

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
    // OPPORTUNITY SEARCH OPERATIONS
    // ========================================
    
    searchOpportunities(searchTerm, category, urgency) {
        // Get all non-deleted requests (CSR can see all requests regardless of status)
        let opportunities = RequestHelpers.findAll({
            isDeleted: false
        });

        // Filter by search term
        if (searchTerm) {
            opportunities = opportunities.filter(opp =>
                opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opp.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (category && category !== 'all') {
            opportunities = opportunities.filter(opp => opp.category === category);
        }

        // Filter by urgency
        if (urgency && urgency !== 'all') {
            opportunities = opportunities.filter(opp => opp.urgency === urgency);
        }

        return {
            success: true,
            data: {
                opportunities: opportunities
            },
            count: opportunities.length
        };
    }

    viewOpportunity(opportunityId) {
        const opportunity = RequestHelpers.findOne({ 
            id: opportunityId,
            isDeleted: false 
        });

        if (!opportunity) {
            return { success: false, error: "Opportunity not found" };
        }

        return {
            success: true,
            data: {
                opportunity: opportunity
            }
        };
    }

    // ========================================
    // SHORTLIST OPERATIONS
    // ========================================
    
    saveToShortlist(userId, opportunityId) {
        // Check if opportunity exists
        const opportunity = RequestHelpers.findOne({ 
            id: opportunityId,
            isDeleted: false 
        });

        if (!opportunity) {
            return { success: false, error: "Opportunity not found" };
        }

        // Check if already in shortlist
        const existing = ShortlistHelpers.findOne({
            userId: userId,
            requestId: opportunityId,
            isDeleted: false
        });

        if (existing) {
            return { success: false, error: "Already in shortlist" };
        }

        // Add to shortlist
        const result = ShortlistHelpers.create({
            userId: userId,
            requestId: opportunityId,
            requestTitle: opportunity.title,
            requestCategory: opportunity.category,
            addedAt: new Date().toISOString(),
            status: 'active'
        });

        return result;
    }

    viewShortlist(userId) {
        const shortlist = ShortlistHelpers.findAll({
            userId: userId,
            isDeleted: false
        });

        return {
            success: true,
            data: shortlist,
            count: shortlist.length
        };
    }

    searchShortlist(userId, searchTerm, category) {
        let shortlist = ShortlistHelpers.findAll({
            userId: userId,
            isDeleted: false
        });

        // Filter by search term
        if (searchTerm) {
            shortlist = shortlist.filter(item =>
                item.requestTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (category && category !== 'all') {
            shortlist = shortlist.filter(item => item.requestCategory === category);
        }

        return {
            success: true,
            data: shortlist,
            count: shortlist.length
        };
    }

    removeFromShortlist(userId, shortlistId) {
        const shortlistItem = ShortlistHelpers.findOne({
            id: shortlistId,
            userId: userId,
            isDeleted: false
        });

        if (!shortlistItem) {
            return { success: false, error: "Shortlist item not found" };
        }

        const result = ShortlistHelpers.delete(shortlistId);
        return result;
    }

    // ========================================
    // HISTORY OPERATIONS
    // ========================================
    
    searchHistory(serviceType, startDate, endDate) {
        let matches = MatchHelpers.findAll({ isDeleted: false });

        // Filter by service type
        if (serviceType && serviceType !== 'all') {
            matches = matches.filter(m => m.serviceType === serviceType);
        }

        // Filter by date range
        if (startDate) {
            matches = matches.filter(m => new Date(m.completedAt) >= new Date(startDate));
        }

        if (endDate) {
            matches = matches.filter(m => new Date(m.completedAt) <= new Date(endDate));
        }

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    viewHistory() {
        const matches = MatchHelpers.findAll({ isDeleted: false });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }
}

module.exports = CSRRepresentative;

