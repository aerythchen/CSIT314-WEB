const personinneed_logout = require('../controller/personinneed_logout');

class Personinneed_logoutBoundary {
    constructor() {
        this.controller = new personinneed_logout();
    }

    async handleLogout(data) {
        try {
            // Simple logout - just call controller
            const result = await this.controller.logout(data);
            
            // Add redirect URL for successful logout
            if (result.success) {
                return { ...result, redirectUrl: '/auth/login' };
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message || "An unexpected error occurred" };
        }
    }
}

module.exports = Personinneed_logoutBoundary;