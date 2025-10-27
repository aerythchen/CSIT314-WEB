const platformmanager_generateweeklyreport = require('../controller/platformmanager_generateweeklyreport');

class Platformmanager_generateweeklyreportBoundary {
    constructor() {
        this.controller = new platformmanager_generateweeklyreport();
    }

    async handleGenerateWeeklyReport(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.generateWeeklyReport(formattedData);
        } catch (error) {
            console.error('Error in handleGenerateWeeklyReport:', error);
            return {
                success: false,
                error: "Failed to generate weekly report: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_generateweeklyreportBoundary;