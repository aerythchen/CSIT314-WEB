const TrackViewsEntity = require('../entity/personinneed_trackviews');

class TrackViewsController {
    constructor() {
        this.entity = new TrackViewsEntity();
        this.entity.initialize();
    }

    trackViews(requestId, userId) {
        console.log(`TrackViewsController: Tracking views for request ${requestId}...`);
        
        if (!requestId || !userId) {
            return {
                success: false,
                error: "Request ID and User ID are required",
                data: null
            };
        }
        
        // Get view count and statistics
        const viewStats = this.getViewCount(requestId);
        
        // Process the view tracking
        return this.processViewTracking(requestId, userId, viewStats);
    }

    getViewCount(requestId) {
        console.log(`Fetching view count for request ${requestId}...`);
        
        // Entity will handle fetching view statistics from database
        return { requestId: requestId };
    }

    processViewTracking(requestId, userId, viewStats) {
        console.log("Processing view tracking...");
        
        // Use Entity to fetch and store view tracking data
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
        
        console.log("View tracking processed successfully");
        
        return {
            success: true,
            data: trackingData.data,
            message: "View statistics retrieved successfully"
        };
    }
}

module.exports = TrackViewsController;

