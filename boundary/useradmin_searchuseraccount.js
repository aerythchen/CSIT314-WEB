const useradmin_searchuseraccount = require('../controller/useradmin_searchuseraccount');

class Useradmin_searchuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_searchuseraccount();
    }

    handleSearchUserAccount(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.searchUserAccount(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchUserAccount(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for searchuseraccount business logic
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

module.exports = Useradmin_searchuseraccountBoundary;