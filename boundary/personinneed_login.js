const personinneed_login = require('../controller/personinneed_login');

class Personinneed_loginBoundary {
    constructor() {
        this.controller = new personinneed_login();
    }

    handleLogin(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.login(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleLogin(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for login business logic
        return {
            email: uiData.email,
            password: uiData.password,
            userType: 'personinneed'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            // Pass through user data for session creation
            const userData = result.data && result.data.user ? result.data.user : null;
            
            // Add display name if user data exists
            if (userData && !userData.name) {
                userData.name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email;
            }
            
            return {
                success: true,
                message: result.message || 'Login successful',
                data: {
                    user: userData,
                    session: result.data && result.data.session ? result.data.session : null
                },
                redirectUrl: result.redirectUrl || '/personinneed/dashboard'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    }
}

module.exports = Personinneed_loginBoundary;