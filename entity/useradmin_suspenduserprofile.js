const { db } = require('../database');

class SuspendUserProfileEntity {
    constructor() {
        this.profile = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("SuspendUserProfileEntity: Initializing...");
        this.profile = {
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            userType: "",
            status: "suspended",
            suspensionReason: "",
            suspendedAt: null,
            suspendedBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SuspendUserProfileEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        if (!data.reason || typeof data.reason !== 'string' || data.reason.trim().length < 10) {
            return { isValid: false, error: "Valid suspension reason required (min 10 chars)" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SuspendUserProfileEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if profile exists
        const existing = db.findById('userProfiles', data.userId);
        if (!existing || existing.isDeleted) {
            return {
                success: false,
                error: "Profile not found"
            };
        }

        // Check if already suspended
        if (existing.status === 'suspended') {
            return {
                success: false,
                error: "Profile is already suspended"
            };
        }

        const now = new Date().toISOString();

        // Invalidate all active sessions for this user
        const sessions = db.find('sessions', { profileId: data.userId, status: 'active' });
        sessions.forEach(session => {
            db.update('sessions', session.id, { status: 'revoked' });
        });

        // Update profile status to suspended
        const result = db.update('userProfiles', data.userId, {
            status: "suspended",
            suspensionReason: data.reason,
            suspendedAt: now,
            suspendedBy: data.suspendedBy || "useradmin"
        });

        if (!result.success) {
            return result;
        }

        this.profile = result.data;
        this.profile.activeSessions = 0;

        // Create audit log entry
        db.insert('auditLogs', {
            action: 'SUSPEND_USER_PROFILE',
            entityType: 'userProfile',
            entityId: this.profile.id,
            performedBy: data.suspendedBy || 'useradmin',
            performedByType: 'useradmin',
            details: {
                reason: data.reason,
                sessionsRevoked: sessions.length
            }
        });

        console.log("Profile suspended successfully");
        return {
            success: true,
            message: "User profile suspended",
            data: {
                id: this.profile.id,
                status: this.profile.status,
                suspendedAt: this.profile.suspendedAt
            }
        };
    }

    getData() {
        console.log("SuspendUserProfileEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: {
                id: this.profile.id,
                firstName: this.profile.firstName,
                lastName: this.profile.lastName,
                email: this.profile.email,
                userType: this.profile.userType,
                status: this.profile.status,
                suspensionReason: this.profile.suspensionReason,
                suspendedAt: this.profile.suspendedAt,
                suspendedBy: this.profile.suspendedBy,
                activeSessions: this.profile.activeSessions
            }
        };
    }
}

module.exports = SuspendUserProfileEntity;

