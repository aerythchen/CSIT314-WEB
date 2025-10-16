const personinneed_searchrequest = require('../controller/personinneed_searchrequest');

class Personinneed_searchrequestBoundary {
    constructor() {
        this.controller = new personinneed_searchrequest();
    }

    handleSearchRequest(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.searchRequest(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchRequest(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for searchrequest business logic
        return {
            ...uiData,
            userType: 'personinneed'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'Operation successful',
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

module.exports = Personinneed_searchrequestBoundary;