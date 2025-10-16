const personinneed_createrequest = require('../controller/personinneed_createrequest');

class Personinneed_createrequestBoundary {
    constructor() {
        this.controller = new personinneed_createrequest();
    }

    handleCreateRequest(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.createRequest(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleCreateRequest(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for createrequest business logic
        return {
            title: uiData.title,
            category: uiData.category,
            description: uiData.description,
            urgency: uiData.urgency,
            contact: uiData.contact,
            createdBy: uiData.userId,
            userType: 'personinneed',
            status: 'pending'
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

module.exports = Personinneed_createrequestBoundary;