const platformmanager_searchreport = require('../controller/platformmanager_searchreport');

class Platformmanager_searchreportBoundary {
    constructor() {
        this.controller = new platformmanager_searchreport();
    }

    async handleSearchReport(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.searchReport(formattedData);
        } catch (error) {
            console.error('Error in handleSearchReport:', error);
            return {
                success: false,
                error: "Failed to search reports: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_searchreportBoundary;