const platformmanager_generateweeklyreport = require('../controller/platformmanager_generateweeklyreport');

class Platformmanager_generateweeklyreportBoundary {
    constructor() {
        this.controller = new platformmanager_generateweeklyreport();
    }

    handleGenerateWeeklyReport(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.generateWeeklyReport(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleGenerateWeeklyReport(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for generateweeklyreport business logic
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

module.exports = Platformmanager_generateweeklyreportBoundary;