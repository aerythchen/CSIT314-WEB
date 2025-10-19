const csrrepresentative_viewopportunity = require('../controller/csrrepresentative_viewopportunity');

class Csrrepresentative_viewopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewopportunity();
    }

    async handleViewOpportunity(data) {
        return await this.controller.viewOpportunity(data);
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