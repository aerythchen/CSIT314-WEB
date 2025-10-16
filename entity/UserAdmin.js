const { db } = require('../database');
const { UserProfileHelpers, UserAccountHelpers, SessionHelpers } = require('../database/helpers');

/**
 * UserAdmin Entity - Consolidated entity for all User Admin operations
 */
class UserAdmin {
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
            userType: 'useradmin',
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
            userType: 'useradmin',
            role: 'admin',
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
            role: 'admin',
            permissions: ['manage_users', 'manage_profiles', 'system_admin']
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
    // USER PROFILE OPERATIONS
    // ========================================
    
    createUserProfile(email, firstName, lastName, userType, phoneNumber) {
        const result = UserProfileHelpers.create({
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            userType: userType,
            phoneNumber: phoneNumber || '',
            status: 'active',
            createdAt: new Date().toISOString()
        });

        return result;
    }

    viewUserProfiles() {
        const profiles = UserProfileHelpers.findAll({ isDeleted: false });

        return {
            success: true,
            data: profiles,
            count: profiles.length
        };
    }

    viewUserProfile(profileId) {
        const profile = UserProfileHelpers.findOne({ 
            id: profileId,
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        return {
            success: true,
            data: profile
        };
    }

    updateUserProfile(profileId, firstName, lastName, phoneNumber, status) {
        const profile = UserProfileHelpers.findOne({ 
            id: profileId,
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        const updateData = {};
        if (firstName) updateData.firstName = firstName.trim();
        if (lastName) updateData.lastName = lastName.trim();
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (status) updateData.status = status;
        updateData.updatedAt = new Date().toISOString();

        const result = UserProfileHelpers.update(profileId, updateData);
        return result;
    }

    suspendUserProfile(profileId) {
        const profile = UserProfileHelpers.findOne({ 
            id: profileId,
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        const result = UserProfileHelpers.update(profileId, {
            status: 'suspended',
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    searchUserProfiles(searchTerm, userType) {
        let profiles = UserProfileHelpers.findAll({ isDeleted: false });

        if (searchTerm) {
            profiles = profiles.filter(p =>
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (userType && userType !== 'all') {
            profiles = profiles.filter(p => p.userType === userType);
        }

        return {
            success: true,
            data: profiles,
            count: profiles.length
        };
    }

    // ========================================
    // USER ACCOUNT OPERATIONS
    // ========================================
    
    createUserAccount(profileId, username, password) {
        const result = UserAccountHelpers.create({
            profileId: profileId,
            username: username.trim(),
            password: password, // In production, this would be hashed
            status: 'active',
            loginAttempts: 0,
            createdAt: new Date().toISOString()
        });

        return result;
    }

    viewUserAccounts() {
        const accounts = UserAccountHelpers.findAll({ isDeleted: false });

        return {
            success: true,
            data: accounts,
            count: accounts.length
        };
    }

    viewUserAccount(accountId) {
        const account = UserAccountHelpers.findOne({ 
            id: accountId,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Account not found" };
        }

        return {
            success: true,
            data: account
        };
    }

    updateUserAccount(accountId, username, password, status) {
        const account = UserAccountHelpers.findOne({ 
            id: accountId,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const updateData = {};
        if (username) updateData.username = username.trim();
        if (password) updateData.password = password; // Would be hashed in production
        if (status) updateData.status = status;
        updateData.updatedAt = new Date().toISOString();

        const result = UserAccountHelpers.update(accountId, updateData);
        return result;
    }

    suspendUserAccount(accountId) {
        const account = UserAccountHelpers.findOne({ 
            id: accountId,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const result = UserAccountHelpers.update(accountId, {
            status: 'locked',
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    searchUserAccounts(searchTerm, status) {
        let accounts = UserAccountHelpers.findAll({ isDeleted: false });

        if (searchTerm) {
            accounts = accounts.filter(a =>
                a.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (status && status !== 'all') {
            accounts = accounts.filter(a => a.status === status);
        }

        return {
            success: true,
            data: accounts,
            count: accounts.length
        };
    }
}

module.exports = UserAdmin;

