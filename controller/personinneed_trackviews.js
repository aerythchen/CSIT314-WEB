const Request = require('../entity/Request');

class TrackViewsController {
    constructor() {
        this.entity = new Request();
    }

    // Get view count for person's requests
    async getViewCount(data) {
        try {
            // Validate required data
            if (!data.requestId || !data.userId) {
                return {
                    success: false,
                    error: "Missing required data: requestId and userId are required"
                };
            }

            // Use Entity to get the view count
            const result = this.entity.getViewCount(data.requestId);
            
            if (result.success) {
                return {
                    success: true,
                    message: "View count retrieved successfully",
                    data: {
                        requestId: data.requestId,
                        userId: data.userId,
                        viewCount: result.data.viewCount || 0,
                        timestamp: new Date().toISOString()
                    }
                };
            } else {
                return result;
            }
        } catch (error) {
            return {
                success: false,
                error: "Internal error while retrieving view count"
            };
        }
    }
}

module.exports = TrackViewsController;
