const SuspendUserProfileEntity = require('../entity/UserAdmin');

class SuspendUserProfileController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    suspendUserProfile(data) {
        console.log("SuspendUserProfileController: Processing profile suspension...");
        
        const validationResult = this.validateSuspendAction(userId, reason);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                profile: null
            };
        }
        
        return this.processSuspendAction(userId, reason);
    }

    validateSuspendAction(userId, reason) {
        console.log("Validating suspension request...");
        
        if (!userId || userId.trim() === "") {
            return { isValid: false, error: "User ID is required" };
        }
        
        if (!reason || reason.trim() === "") {
            return { isValid: false, error: "Suspension reason is required" };
        }
        
        if (reason.length < 10) {
            return { isValid: false, error: "Suspension reason must be at least 10 characters" };
        }
        
        if (reason.length > 500) {
            return { isValid: false, error: "Suspension reason must not exceed 500 characters" };
        }
        
        // Business rules
        // In real app: Check if profile is already suspended, check if it's a system admin, etc.
        
        return { isValid: true };
    }

    processSuspendAction(userId, reason) {
        console.log(`Processing suspension for user: ${userId}...`);
        
        const entityResult = this.entity.process({
            userId: userId.trim(),
            reason: reason.trim(),
            suspendedBy: "useradmin"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profile: null
            };
        }
        
        const profileData = this.entity.getData();
        
        console.log(`Profile suspended successfully: ${profileData.data.id}`);
        
        return {
            success: true,
            profile: profileData.data,
            message: "User profile suspended successfully"
        };
    }
}

module.exports = SuspendUserProfileController;

