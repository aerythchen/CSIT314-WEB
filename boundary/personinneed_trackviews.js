const personinneed_trackviews = require('../controller/personinneed_trackviews');

class Personinneed_trackviewsBoundary {
    constructor() {
        this.controller = new personinneed_trackviews();
    }

    // Handle getting view count for person's requests
    async handleGetViewCount(data) {
        // 1. CALL CONTROLLER with complete data
        const result = await this.controller.getViewCount({
            ...data,
            requestId: data.requestId,
            userId: data.userId,
            userType: data.userType || 'personinneed'
        });
        
        // 2. FORMAT RESPONSE FOR UI (UI Logic)
        if (result.success) {
            return {
                ...result,
                message: result.message || 'View count retrieved successfully',
                data: {
                    requestId: data.requestId,
                    viewCount: result.data?.viewCount || 0,
                    timestamp: result.data?.timestamp
                }
            };
        } else {
            return {
                success: false,
                error: result.error || 'Failed to retrieve view count',
                message: 'Unable to get view count for your request'
            };
        }
    }
}

module.exports = Personinneed_trackviewsBoundary;
