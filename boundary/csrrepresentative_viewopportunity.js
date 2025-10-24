const csrrepresentative_viewopportunity = require('../controller/csrrepresentative_viewopportunity');

class Csrrepresentative_viewopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewopportunity();
    }

    async handleViewOpportunity(data) {
        const result = await this.controller.viewOpportunity(data);
        
        // Return JSON response
        return result;
    }

    async handleAcceptRequest(data) {
        const { requestId } = data;
        
        if (!requestId) {
            return {
                success: false,
                error: "Request ID is required",
                data: null
            };
        }
        
        return await this.controller.acceptRequest(data);
    }
}

module.exports = Csrrepresentative_viewopportunityBoundary;