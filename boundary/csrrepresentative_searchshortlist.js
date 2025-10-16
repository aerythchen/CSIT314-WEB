const csrrepresentative_searchshortlist = require('../controller/csrrepresentative_searchshortlist');

class Csrrepresentative_searchshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchshortlist();
    }

    handleSearchShortlist(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.searchShortlist(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchShortlist(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for searchshortlist business logic
        return {
            ...uiData,
            userType: 'csrrepresentative'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'Operation successful',
                redirectUrl: result.redirectUrl || '/csrrepresentative/dashboard'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    }
}

module.exports = Csrrepresentative_searchshortlistBoundary;