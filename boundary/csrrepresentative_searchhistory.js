const SearchHistoryController = require('../controller/csrrepresentative_searchhistory');

class Csrrepresentative_searchhistoryBoundary {
    constructor() {
        this.controller = new SearchHistoryController();
    }

    handleSearchHistory(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.searchHistory(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchHistory(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for search history business logic
        return {
            userId: uiData.userId,
            serviceType: uiData.serviceType || null,
            startDate: uiData.startDate || null,
            endDate: uiData.endDate || null,
            userType: 'csrrepresentative'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'History search completed successfully',
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

module.exports = Csrrepresentative_searchhistoryBoundary;

