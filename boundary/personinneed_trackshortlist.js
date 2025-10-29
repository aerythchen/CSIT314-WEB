const personinneed_trackshortlist = require('../controller/personinneed_trackshortlist');

class Personinneed_trackshortlistBoundary {
    constructor() {
        this.controller = new personinneed_trackshortlist();
    }

    // Handle getting shortlist count for person's requests
    async handleGetShortlistCount(data) {
        // 1. CALL CONTROLLER with complete data
        const result = await this.controller.getShortlistCount({
            ...data,
            requestId: data.requestId,
            userId: data.userId,
            userType: data.userType || 'personinneed'
        });
        
        // 2. FORMAT RESPONSE FOR UI (UI Logic)
        if (result.success) {
            return {
                ...result,
                message: result.message || 'Shortlist count retrieved successfully',
                data: {
                    requestId: data.requestId,
                    shortlistCount: result.data?.shortlistCount || 0,
                    timestamp: result.data?.timestamp
                }
            };
        } else {
            return {
                success: false,
                error: result.error || 'Failed to retrieve shortlist count',
                message: 'Unable to get shortlist count for your request'
            };
        }
    }
}

module.exports = Personinneed_trackshortlistBoundary;
