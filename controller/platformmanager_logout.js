const LogoutEntity = require('../entity/platformmanager_logout');

class LogoutController {
    constructor() {
        this.entity = new LogoutEntity();
        this.entity.initialize();
    }

    logout(sessionId, userId) {
        console.log("LogoutController: Processing Platform Manager logout...");
        
        // Validate logout request
        const validationResult = this.validateLogoutRequest(sessionId, userId);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }
        
        // Process the logout
        return this.processLogout(sessionId, userId);
    }

    validateLogoutRequest(sessionId, userId) {
        console.log("Validating logout request...");
        
        if (!sessionId) {
            return {
                isValid: false,
                error: "Session ID is required"
            };
        }
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }

        // Additional validation for platform manager
        if (typeof sessionId !== 'string') {
            return {
                isValid: false,
                error: "Invalid session ID format"
            };
        }
        
        return { isValid: true };
    }

    processLogout(sessionId, userId) {
        console.log(`Processing logout for Platform Manager session ${sessionId}...`);
        
        // Use Entity to store logout data and invalidate session
        const entityResult = this.entity.process({
            sessionId: sessionId,
            userId: userId,
            userType: "platformmanager"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error
            };
        }
        
        // Get stored data
        const logoutData = this.entity.getData();
        
        console.log(`Platform Manager ${userId} logged out successfully at ${logoutData.data.logoutTime}`);
        
        return {
            success: true,
            message: "Platform Manager logout successful",
            timestamp: logoutData.data.logoutTime,
            clearAdminCache: true
        };
    }
}

module.exports = LogoutController;

