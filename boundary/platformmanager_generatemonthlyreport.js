const platformmanager_generatemonthlyreport = require('../controller/platformmanager_generatemonthlyreport');

class Platformmanager_generatemonthlyreportBoundary {
    constructor() {
        this.controller = new platformmanager_generatemonthlyreport();
    }

    handleGenerateMonthlyReport(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.generateMonthlyReport(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleGenerateMonthlyReport(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for generatemonthlyreport business logic
        return {
            ...uiData,
            userType: 'platformmanager'
        };
    }
    
    formatResponseForUI(result) {
        // Simple response formatting for UI
        if (result.success) {
            return {
                success: true,
                message: result.message || 'Operation successful',
                redirectUrl: result.redirectUrl || '/platformmanager/dashboard'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    }
}

module.exports = Platformmanager_generatemonthlyreportBoundary;