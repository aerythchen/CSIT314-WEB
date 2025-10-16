const personinneed_viewrequest = require('../controller/personinneed_viewrequest');

class Personinneed_viewrequestBoundary {
    constructor() {
        this.controller = new personinneed_viewrequest();
    }

    handleViewRequest(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.viewRequest(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleViewRequest(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for viewrequest business logic
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

module.exports = Personinneed_viewrequestBoundary;