const { db } = require('../database');

/**
 * UserProfile Entity - Handles user profile business logic
 * Contains methods for profile operations regardless of user type
 */
class UserProfile {
    constructor() {
        this.db = db;
    }

    // ========================================
    // PROFILE AUTHENTICATION
    // ========================================
    
    async authenticateProfile(email, password, userType) {
        // Find user profile by email and user type
        const profile = await db.findOne('userProfiles', { 
            email: email, 
            usertype: userType
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

        return { success: true, profile: profile };
    }

    // ========================================
    // PROFILE MANAGEMENT
    // ========================================
    
    async createProfile(profileData) {
        const profile = {
            id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            firstname: profileData.firstName,
            lastname: profileData.lastName,
            email: profileData.email,
            usertype: profileData.userType,
            status: 'active',
            createdat: new Date().toISOString(),
            updatedat: null, // New users haven't been updated yet
            isdeleted: false
        };

        const result = await db.insert('userProfiles', profile);
        return result;
    }

    async updateProfile(profileId, updateData) {
        const profile = await db.findOne('userProfiles', { id: profileId });
        
        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        // Only update the fields that are provided in updateData
        const updatedProfile = {
            ...updateData,
            updatedat: new Date().toISOString()
        };

        const result = await db.update('userProfiles', profileId, updatedProfile);
        return result;
    }

    async getProfile(profileId) {
        const profile = await db.findOne('userProfiles', { id: profileId });
        
        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        // Get user account to include username information
        const userAccounts = await db.find('userAccounts', {});
        const account = userAccounts.find(acc => acc.profileid === profileId);
        
        const profileWithAccount = {
            ...profile,
            username: account ? account.username : null
        };

        return { success: true, data: profileWithAccount };
    }

    // Alias for getUserProfile to match controller expectations
    async getUserProfile(profileId) {
        return await this.getProfile(profileId);
    }

    async deleteProfile(profileId) {
        const profile = await db.findOne('userProfiles', { id: profileId });
        
        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        // Use hard delete instead of soft delete
        const result = await db.hardDelete('userProfiles', profileId);

        return result;
    }

    // ========================================
    // PROFILE SEARCH
    // ========================================
    
    async searchProfiles(searchTerm, userType, status) {
        let profiles = await db.find('userProfiles', {});

        // Filter by user type
        if (userType && userType !== 'all') {
            profiles = profiles.filter(p => p.usertype === userType);
        }

        // Filter by status
        if (status && status !== 'all') {
            profiles = profiles.filter(p => p.status === status);
        }

        // Filter by search term
        if (searchTerm) {
            profiles = profiles.filter(p =>
                p.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Get user accounts to include username information
        const userAccounts = await db.find('userAccounts', {});

        // Combine profile and account data
        const usersWithAccounts = profiles.map(profile => {
            // Find matching account for this profile
            const account = userAccounts.find(acc => acc.profileid === profile.id);
            
            return {
                ...profile,
                username: account ? account.username : null
            };
        });

        return {
            success: true,
            data: usersWithAccounts,
            count: usersWithAccounts.length
        };
    }

    // ========================================
    // PROFILE STATUS MANAGEMENT
    // ========================================
    
    suspendProfile(profileId) {
        return this.updateProfile(profileId, { status: 'suspended' });
    }

    activateProfile(profileId) {
        return this.updateProfile(profileId, { status: 'active' });
    }
}

module.exports = UserProfile;
