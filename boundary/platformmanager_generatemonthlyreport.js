const platformmanager_generatemonthlyreport = require('../controller/platformmanager_generatemonthlyreport');

class Platformmanager_generatemonthlyreportBoundary {
    constructor() {
        this.controller = new platformmanager_generatemonthlyreport();
    }

    async handleGenerateMonthlyReport(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.generateMonthlyReport(formattedData);
        } catch (error) {
            console.error('Error in handleGenerateMonthlyReport:', error);
            return {
                success: false,
                error: "Failed to generate monthly report: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_generatemonthlyreportBoundary;