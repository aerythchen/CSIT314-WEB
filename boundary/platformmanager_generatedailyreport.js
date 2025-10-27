const platformmanager_generatedailyreport = require('../controller/platformmanager_generatedailyreport');

class Platformmanager_generatedailyreportBoundary {
    constructor() {
        this.controller = new platformmanager_generatedailyreport();
    }

    async handleGenerateDailyReport(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.generateDailyReport(formattedData);
        } catch (error) {
            console.error('Error in handleGenerateDailyReport:', error);
            return {
                success: false,
                error: "Failed to generate daily report: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_generatedailyreportBoundary;