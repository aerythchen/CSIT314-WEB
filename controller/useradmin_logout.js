const LogoutEntity = require('../entity/UserAdmin');

class LogoutController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    logout(sessionId, userId) {
        console.log("LogoutController: Processing User Admin logout...");
        
        const validationResult = this.validateLogoutRequest(sessionId, userId);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }
        
        return this.processLogout(sessionId, userId);
    }

    validateLogoutRequest(sessionId, userId) {
        console.log("Validating logout request...");
        
        if (!sessionId) {
            return { isValid: false, error: "Session ID is required" };
        }
        
        if (!userId) {
            return { isValid: false, error: "User ID is required" };
        }

        if (typeof sessionId !== 'string') {
            return { isValid: false, error: "Invalid session ID format" };
        }
        
        return { isValid: true };
    }

    processLogout(sessionId, userId) {
        console.log(`Processing logout for User Admin session ${sessionId}...`);
        
        const entityResult = this.entity.process({
            sessionId: sessionId,
            userId: userId,
            userType: "useradmin"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error
            };
        }
        
        const logoutData = this.entity.getData();
        
        console.log(`User Admin ${userId} logged out successfully at ${logoutData.data.logoutTime}`);
        
        return {
            success: true,
            message: "User Admin logout successful",
            timestamp: logoutData.data.logoutTime,
            clearAdminCache: true
        };
    }
}

module.exports = LogoutController;

