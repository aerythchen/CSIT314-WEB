const TrackShortlistEntity = require('../entity/personinneed_trackshortlist');

class TrackShortlistController {
    constructor() {
        this.entity = new TrackShortlistEntity();
        this.entity.initialize();
    }

    trackShortlist(requestId, userId) {
        console.log(`TrackShortlistController: Tracking shortlist for request ${requestId}...`);
        
        if (!requestId || !userId) {
            return {
                success: false,
                error: "Request ID and User ID are required",
                data: null
            };
        }
        
        // Get shortlist count and statistics
        const shortlistStats = this.getShortlistCount(requestId);
        
        // Process the shortlist tracking
        return this.processShortlistTracking(requestId, userId, shortlistStats);
    }

    getShortlistCount(requestId) {
        console.log(`Fetching shortlist count for request ${requestId}...`);
        
        // Entity will handle fetching shortlist statistics from database
        return { requestId: requestId };
    }

    processShortlistTracking(requestId, userId, shortlistStats) {
        console.log("Processing shortlist tracking...");
        
        // Use Entity to fetch and store shortlist tracking data
        const entityResult = this.entity.process({
            requestId: requestId,
            userId: userId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: null
            };
        }
        
        // Get stored data
        const trackingData = this.entity.getData();
        
        console.log("Shortlist tracking processed successfully");
        
        return {
            success: true,
            data: trackingData.data,
            message: "Shortlist statistics retrieved successfully"
        };
    }
}

module.exports = TrackShortlistController;

