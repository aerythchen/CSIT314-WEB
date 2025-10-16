const useradmin_createuseraccount = require('../controller/useradmin_createuseraccount');

class Useradmin_createuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_createuseraccount();
    }

    handleCreateUserAccount(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.createUserAccount(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleCreateUserAccount(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for createuseraccount business logic
        return {
            username: uiData.username,
            email: uiData.email,
            password: uiData.password,
            createdBy: uiData.userId,
            userType: 'useradmin'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'Operation successful',
                redirectUrl: result.redirectUrl || '/useradmin/dashboard'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    }
}

module.exports = Useradmin_createuseraccountBoundary;