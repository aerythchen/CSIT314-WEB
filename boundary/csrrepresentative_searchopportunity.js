const csrrepresentative_searchopportunity = require('../controller/csrrepresentative_searchopportunity');

class Csrrepresentative_searchopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchopportunity();
    }

    handleSearchOpportunity(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.searchOpportunity(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchOpportunity(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for searchopportunity business logic
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
                message: result.message || 'Search completed successfully',
                data: result.data, // Pass the data to server for rendering
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

module.exports = Csrrepresentative_searchopportunityBoundary;