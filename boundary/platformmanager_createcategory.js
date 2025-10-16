const platformmanager_createcategory = require('../controller/platformmanager_createcategory');

class Platformmanager_createcategoryBoundary {
    constructor() {
        this.controller = new platformmanager_createcategory();
    }

    handleCreateCategory(data) {
        // 1. DATA FORMATTING (UI Logic)
        const formattedData = this.formatDataForController(data);
        
        // 2. CALL CONTROLLER
        const result = this.controller.createCategory(formattedData);
        
        // 3. FORMAT RESPONSE FOR UI (UI Logic)
        return this.formatResponseForUI(result);
    }

    handleFormSubmission(formData) {
        return this.handleCreateCategory(formData);
    }
    
    formatDataForController(uiData) {
        // Format UI data for createcategory business logic
        return {
            categoryName: uiData.categoryName,
            description: uiData.description,
            createdBy: uiData.userId,
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

module.exports = Platformmanager_createcategoryBoundary;