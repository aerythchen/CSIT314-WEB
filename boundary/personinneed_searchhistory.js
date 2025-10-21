const personinneed_searchhistory = require('../controller/personinneed_searchhistory');

class Personinneed_searchhistoryBoundary {
    constructor() {
        this.controller = new personinneed_searchhistory();
    }

    async handleSearchHistory(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = await this.controller.searchHistory(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleSearchHistory(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for searchhistory business logic
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

module.exports = Personinneed_searchhistoryBoundary;