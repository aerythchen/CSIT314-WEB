const Request = require('../entity/Request');

class TrackShortlistController {
    constructor() {
        this.entity = new Request();
    }

    // Get shortlist count for person's requests (retrieve only, don't increment)
    async getShortlistCount(data) {
        try {
            // Validate required data
            if (!data.requestId || !data.userId) {
                return {
                    success: false,
                    error: "Missing required data: requestId and userId are required"
                };
            }

            // Use Entity to get the shortlist count
            const result = this.entity.getShortlistCount(data.requestId);
            
            if (result.success) {
                return {
                    success: true,
                    message: "Shortlist count retrieved successfully",
                    data: {
                        requestId: data.requestId,
                        userId: data.userId,
                        shortlistCount: result.data.shortlistCount || 0,
                        timestamp: new Date().toISOString()
                    }
                };
            } else {
                return result;
            }
        } catch (error) {
            return {
                success: false,
                error: "Internal error while retrieving shortlist count"
            };
        }
    }
}

module.exports = TrackShortlistController;
