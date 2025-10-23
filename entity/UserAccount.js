const { db } = require('../database');
const { SessionHelpers } = require('../database/helpers');
const Session = require('./Session');

/**
 * UserAccount Entity - Handles user account business logic
 * Contains methods for account operations and authentication
 */
class UserAccount {
    constructor() {
        this.db = db;
        this.session = new Session();
    }

    // ========================================
    // ACCOUNT AUTHENTICATION
    // ========================================
    
    async login(email, password, userType) {
        // Find user profile by email and user type
        const profile = await db.findOne('userProfiles', { 
            email: email, 
            userType: userType,
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Invalid email or password" };
        }

        // Check if profile is suspended
        if (profile.status === 'suspended') {
            return { success: false, error: "Account is suspended" };
        }

        // Find associated account
        const account = await db.findOne('userAccounts', { 
            profileId: profile.id
        });

        if (!account) {
            return { success: false, error: "Invalid email or password" };
        }

        // Validate password (in production, this would use bcrypt)
        if (account.passwordhash !== password) {
            return { success: false, error: "Invalid email or password" };
        }

        // Check if account is locked
        if (account.status === 'locked') {
            return { success: false, error: "Account is locked" };
        }

        // Update last login
        this.updateLastLogin(account.id);

        // Create session
        const sessionToken = this.session.generateSessionToken();
        const expiresAt = this.session.generateSessionExpiry(24);
        
        const sessionData = {
            userId: profile.id,
            token: sessionToken,
            expiresAt: expiresAt
        };

        const sessionResult = await this.session.createSession(sessionData);
        if (!sessionResult.success) {
            return { success: false, error: "Failed to create session" };
        }

        // Return complete login result
        return {
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: profile.id,
                    email: email,
                    firstName: profile.firstname,
                    lastName: profile.lastname,
                    userType: userType,
                    role: this.getUserRole(userType),
                    permissions: this.getUserPermissions(userType)
                },
                session: sessionData
            }
        };
    }

    // ========================================
    // ACCOUNT LOGOUT
    // ========================================
    
    async logout(userId, sessionToken) {
        try {
            // Find and invalidate the session
            const session = await db.findOne('sessions', { 
                userId: userId,
                token: sessionToken,
                isActive: true,
                isDeleted: false 
            });

            if (!session) {
                return { success: false, error: "Session not found or already expired" };
            }

            // Deactivate the session
            const sessionResult = await this.session.deactivateSession(session.id);
            if (!sessionResult.success) {
                return { success: false, error: "Failed to deactivate session" };
            }

            return {
                success: true,
                message: "Logout successful"
            };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: "Logout failed" };
        }
    }

    // ========================================
    // ACCOUNT MANAGEMENT
    // ========================================
    
    async createAccount(accountData) {
        const account = {
            id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            profileid: accountData.profileId,
            username: accountData.username,
            passwordhash: accountData.passwordHash,
            status: 'active',
            lastlogin: null,
            loginattempts: 0,
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            isdeleted: false
        };

        const result = await db.insert('userAccounts', account);
        return result;
    }

    updateAccount(accountId, updateData) {
        const account = db.findOne('userAccounts', { id: accountId });
        
        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const updatedAccount = {
            ...account,
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        const result = db.update('userAccounts', accountId, updatedAccount);
        return result;
    }

    getAccount(accountId) {
        const account = db.findOne('userAccounts', { id: accountId });
        
        if (!account) {
            return { success: false, error: "Account not found" };
        }

        return { success: true, data: account };
    }

    async getAccountByProfileId(profileId) {
        const account = await db.findOne('userAccounts', { profileId: profileId });
        
        if (!account) {
            return { success: false, error: "Account not found" };
        }

        return { success: true, data: account };
    }

    async updateAccount(profileId, updateData) {
        // Find account by profile ID
        const account = await db.findOne('userAccounts', { profileid: profileId });
        
        if (!account) {
            return { success: false, error: "Account not found for this profile" };
        }

        // Only update the fields that are provided in updateData
        const updatedAccount = {
            ...updateData,
            updatedat: new Date().toISOString()
        };

        const result = await db.update('userAccounts', account.id, updatedAccount);
        return result;
    }

    async deleteAccount(accountId) {
        const account = await db.findOne('userAccounts', { id: accountId });
        
        if (!account) {
            return { success: false, error: "Account not found" };
        }

        // Use hard delete instead of soft delete
        const result = await db.hardDelete('userAccounts', accountId);

        return result;
    }

    // ========================================
    // ACCOUNT SEARCH
    // ========================================
    
    searchAccounts(searchTerm, status) {
        let accounts = db.findAll('userAccounts', {});

        // Filter by status
        if (status && status !== 'all') {
            accounts = accounts.filter(a => a.status === status);
        }

        // Filter by search term
        if (searchTerm) {
            accounts = accounts.filter(a =>
                a.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return {
            success: true,
            data: accounts,
            count: accounts.length
        };
    }

    // ========================================
    // ACCOUNT STATUS MANAGEMENT
    // ========================================
    
    lockAccount(accountId) {
        return this.updateAccount(accountId, { status: 'locked' });
    }

    unlockAccount(accountId) {
        return this.updateAccount(accountId, { status: 'active' });
    }

    suspendAccount(accountId) {
        return this.updateAccount(accountId, { status: 'suspended' });
    }

    activateAccount(accountId) {
        return this.updateAccount(accountId, { status: 'active' });
    }

    // ========================================
    // LOGIN TRACKING
    // ========================================
    
    updateLastLogin(accountId) {
        return this.updateAccount(accountId, {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        });
    }

    incrementLoginAttempts(accountId) {
        const account = db.findOne('userAccounts', { id: accountId });
        
        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const newAttempts = (account.loginAttempts || 0) + 1;
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
            return this.lockAccount(accountId);
        }

        return this.updateAccount(accountId, { loginAttempts: newAttempts });
    }

    // ========================================
    // USER ROLE AND PERMISSIONS
    // ========================================
    
    getUserRole(userType) {
        const roleMap = {
            'csrrepresentative': 'representative',
            'personinneed': 'client',
            'platformmanager': 'manager',
            'useradmin': 'admin'
        };
        return roleMap[userType] || 'user';
    }

    getUserPermissions(userType) {
        const permissionMap = {
            'csrrepresentative': ['search_requests', 'view_requests', 'manage_shortlist'],
            'personinneed': ['create_requests', 'view_requests', 'track_requests'],
            'platformmanager': ['manage_categories', 'view_reports', 'manage_system'],
            'useradmin': ['manage_users', 'manage_profiles', 'view_audit_logs']
        };
        return permissionMap[userType] || [];
    }
}

module.exports = UserAccount;
