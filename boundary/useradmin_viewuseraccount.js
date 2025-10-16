const useradmin_viewuseraccount = require('../controller/useradmin_viewuseraccount');

class Useradmin_viewuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_viewuseraccount();
    }

    handleViewUserAccount(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.viewUserAccount(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleViewUserAccount(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for viewuseraccount business logic
        return {
            ...uiData,
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

module.exports = Useradmin_viewuseraccountBoundary;