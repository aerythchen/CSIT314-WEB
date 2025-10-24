const csrrepresentative_viewopportunity = require('../controller/csrrepresentative_viewopportunity');

class Csrrepresentative_viewopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewopportunity();
    }

    async handleViewOpportunity(data) {
        const result = await this.controller.viewOpportunity(data);
        
        // If successful and has opportunity data, render view
        if (result.success && result.data && result.data.opportunity) {
            return {
                success: true,
                renderView: 'csrrepresentative/opportunity_details',
                viewData: {
                    opportunity: result.data.opportunity,
                    success: result.message,
                    error: null
                }
            };
        }
        
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