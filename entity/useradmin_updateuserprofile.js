const { db } = require('../database');

class UpdateUserProfileEntity {
    constructor() {
        this.profile = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("UpdateUserProfileEntity: Initializing...");
        this.profile = {
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            userType: "",
            status: "active",
            createdAt: null,
            updatedAt: null,
            updatedBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("UpdateUserProfileEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        if (!data.firstName && !data.lastName && !data.email) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }

        if (data.firstName !== undefined) {
            if (typeof data.firstName !== 'string' || data.firstName.trim().length < 2) {
                return { isValid: false, error: "Valid first name required (min 2 chars)" };
            }
        }

        if (data.lastName !== undefined) {
            if (typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
                return { isValid: false, error: "Valid last name required (min 2 chars)" };
            }
        }

        if (data.email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return { isValid: false, error: "Invalid email format" };
            }
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("UpdateUserProfileEntity: Processing data...");
        
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

        // Check for duplicate email if email is being changed
        if (data.email && data.email !== existing.email) {
            const duplicate = db.findOne('userProfiles', { 
                email: data.email, 
                isDeleted: false 
            });
            
            if (duplicate && duplicate.id !== data.userId) {
                return {
                    success: false,
                    error: "Email already exists"
                };
            }
        }

        // Prepare update object with only provided fields
        const updateData = {};
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.email) updateData.email = data.email;
        updateData.updatedBy = data.updatedBy || "useradmin";

        // Update profile in database
        const result = db.update('userProfiles', data.userId, updateData);

        if (!result.success) {
            return result;
        }

        this.profile = result.data;

        // Create audit log entry
        db.insert('auditLogs', {
            action: 'UPDATE_USER_PROFILE',
            entityType: 'userProfile',
            entityId: this.profile.id,
            performedBy: data.updatedBy || 'useradmin',
            performedByType: 'useradmin',
            details: updateData
        });

        console.log("Profile data updated successfully");
        return {
            success: true,
            message: "User profile updated",
            data: {
                id: this.profile.id,
                email: this.profile.email,
                updatedAt: this.profile.updatedAt
            }
        };
    }

    getData() {
        console.log("UpdateUserProfileEntity: Retrieving data...");
        
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
                createdAt: this.profile.createdAt,
                updatedAt: this.profile.updatedAt,
                updatedBy: this.profile.updatedBy
            }
        };
    }
}

module.exports = UpdateUserProfileEntity;

