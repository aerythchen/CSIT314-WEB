const useradmin_suspenduseraccount = require('../controller/useradmin_suspenduseraccount');

class Useradmin_suspenduseraccountBoundary {
    constructor() {
        this.controller = new useradmin_suspenduseraccount();
    }

    handleSuspendUserAccount(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.suspendUserAccount(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSuspendUserAccount(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for suspenduseraccount business logic
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

module.exports = Useradmin_suspenduseraccountBoundary;