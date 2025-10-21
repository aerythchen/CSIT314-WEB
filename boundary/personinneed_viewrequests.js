const personinneed_viewrequests = require('../controller/personinneed_viewrequests');

class Personinneed_viewrequestsBoundary {
    constructor() {
        this.controller = new personinneed_viewrequests();
    }

    // Handle getting all user requests (for dashboard)
    async handleViewRequests(data) {
        // 1. CALL CONTROLLER with complete data
        const result = await this.controller.viewRequests({
            ...data,
            userId: data.userId,
            userType: data.userType || 'personinneed'
        });
        
        // 2. FORMAT RESPONSE FOR UI (UI Logic)
        if (result.success) {
            return {
                ...result,
                redirectUrl: result.redirectUrl || '/personinneed/dashboard'
            };
        } else {
            return result;
        }
    }
}

module.exports = Personinneed_viewrequestsBoundary;
