const UpdateUserProfileEntity = require('../entity/useradmin_updateuserprofile');

class UpdateUserProfileController {
    constructor() {
        this.entity = new UpdateUserProfileEntity();
        this.entity.initialize();
    }

    updateUserProfile(userId, firstName, lastName, email) {
        console.log("UpdateUserProfileController: Processing profile update...");
        
        const validationResult = this.validateProfileUpdate(userId, firstName, lastName, email);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                profile: null
            };
        }
        
        return this.processProfileUpdate(userId, firstName, lastName, email);
    }

    validateProfileUpdate(userId, firstName, lastName, email) {
        console.log("Validating profile update data...");
        
        if (!userId || userId.trim() === "") {
            return { isValid: false, error: "User ID is required" };
        }
        
        if (!firstName && !lastName && !email) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }
        
        if (firstName !== undefined && firstName !== null) {
            if (firstName.trim() === "") {
                return { isValid: false, error: "First name cannot be empty" };
            }
            if (firstName.length < 2) {
                return { isValid: false, error: "First name must be at least 2 characters" };
            }
        }
        
        if (lastName !== undefined && lastName !== null) {
            if (lastName.trim() === "") {
                return { isValid: false, error: "Last name cannot be empty" };
            }
            if (lastName.length < 2) {
                return { isValid: false, error: "Last name must be at least 2 characters" };
            }
        }
        
        if (email !== undefined && email !== null) {
            if (email.trim() === "") {
                return { isValid: false, error: "Email cannot be empty" };
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { isValid: false, error: "Invalid email format" };
            }
        }
        
        return { isValid: true };
    }

    processProfileUpdate(userId, firstName, lastName, email) {
        console.log(`Processing update for user: ${userId}...`);
        
        const updateData = {
            userId: userId.trim()
        };
        
        if (firstName !== undefined && firstName !== null) {
            updateData.firstName = firstName.trim();
        }
        
        if (lastName !== undefined && lastName !== null) {
            updateData.lastName = lastName.trim();
        }
        
        if (email !== undefined && email !== null) {
            updateData.email = email.trim().toLowerCase();
        }
        
        const entityResult = this.entity.process(updateData);
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profile: null
            };
        }
        
        const profileData = this.entity.getData();
        
        console.log(`Profile updated successfully: ${profileData.data.email}`);
        
        return {
            success: true,
            profile: profileData.data,
            message: "User profile updated successfully"
        };
    }
}

module.exports = UpdateUserProfileController;

