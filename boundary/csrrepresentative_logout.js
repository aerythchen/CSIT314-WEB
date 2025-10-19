const csrrepresentative_logout = require('../controller/csrrepresentative_logout');

class Csrrepresentative_logoutBoundary {
    constructor() {
        this.controller = new csrrepresentative_logout();
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

module.exports = Csrrepresentative_logoutBoundary;