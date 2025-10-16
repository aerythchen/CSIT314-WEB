const useradmin_updateuseraccount = require('../controller/useradmin_updateuseraccount');

class Useradmin_updateuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_updateuseraccount();
    }

    handleUpdateUserAccount(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.updateUserAccount(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleUpdateUserAccount(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for updateuseraccount business logic
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

module.exports = Useradmin_updateuseraccountBoundary;