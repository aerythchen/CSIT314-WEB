const Request = require('../entity/Request');

class ViewOpportunityController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async viewOpportunity(data) {
        const { opportunityId, userId } = data;
        
        // Track the view count
        await this.entity.trackViews(opportunityId, userId);
        
        // Get specific opportunity details
        const result = await this.entity.viewOpportunity(opportunityId);
        return result;
    }

    async acceptRequest(data) {
        const { userId, requestId, serviceType } = data;
        
        console.log(`ViewOpportunityController: Accepting request ${requestId} for user ${userId}`);
        
        // Call entity to accept request
        const result = await this.entity.acceptRequest(userId, requestId, serviceType);
        return result;
    }
}

module.exports = ViewOpportunityController;

