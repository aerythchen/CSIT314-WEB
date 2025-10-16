const LogoutEntity = require('../entity/personinneed_logout');

class LogoutController {
    constructor() {
        this.entity = new LogoutEntity();
        this.entity.initialize();
    }

    logout(sessionId, userId) {
        console.log("LogoutController: Processing logout...");
        
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
        
        // Verify session is valid (simulated)
        const isSessionValid = true; // Mock validation
        if (!isSessionValid) {
            return {
                isValid: false,
                error: "Invalid session"
            };
        }
        
        return { isValid: true };
    }

    processLogout(sessionId, userId) {
        console.log(`Processing logout for session ${sessionId}...`);
        
        // Use Entity to store logout data
        const entityResult = this.entity.process({
            sessionId: sessionId,
            userId: userId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error
            };
        }
        
        // Get stored data
        const logoutData = this.entity.getData();
        
        console.log(`User ${userId} logged out successfully at ${logoutData.data.logoutTime}`);
        
        return {
            success: true,
            message: "Logout successful",
            timestamp: logoutData.data.logoutTime
        };
    }
}

module.exports = LogoutController;

