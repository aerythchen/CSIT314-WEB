const { db } = require('../database');
const { SessionHelpers } = require('../database/helpers');

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
    
    authenticateProfile(email, password, userType) {
        // Find user profile by email and user type
        const profile = db.findOne('userProfiles', { 
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
            updatedat: new Date().toISOString(),
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

    getProfile(profileId) {
        const profile = db.findOne('userProfiles', { id: profileId });
        
        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        return { success: true, data: profile };
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
    
    searchProfiles(searchTerm, userType, status) {
        let profiles = db.findAll('userProfiles', {});

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

        return {
            success: true,
            data: profiles,
            count: profiles.length
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
