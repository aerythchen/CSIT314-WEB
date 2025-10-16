const ViewHistoryController = require('../controller/csrrepresentative_viewhistory');

class Csrrepresentative_viewhistoryBoundary {
    constructor() {
        this.controller = new ViewHistoryController();
    }

    handleViewHistory(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.viewHistory(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleViewHistory(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for view history business logic
        return {
            userId: uiData.userId,
            userType: 'csrrepresentative'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'History retrieved successfully',
                redirectUrl: '/csrrepresentative/dashboard'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    }
}

module.exports = Csrrepresentative_viewhistoryBoundary;

