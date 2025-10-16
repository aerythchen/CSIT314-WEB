const { db } = require('../database');

class TrackViewsEntity {
    constructor() {
        this.viewData = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("TrackViewsEntity: Initializing...");
        this.viewData = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("TrackViewsEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.requestId || typeof data.requestId !== 'string') {
            return { isValid: false, error: "Valid request ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("TrackViewsEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if request exists
        const request = db.findById('requests', data.requestId);
        if (!request || request.isDeleted) {
            return {
                success: false,
                error: "Request not found"
            };
        }

        // Get all views for this request
        const views = db.find('requestViews', { requestId: data.requestId });

        // Get view details with user information
        const viewDetails = views.map(view => {
            const user = db.findById('userProfiles', view.viewedBy);
            return {
                viewId: view.id,
                viewedAt: view.viewedAt,
                viewedBy: view.viewedBy,
                viewerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                viewerType: user ? user.userType : 'unknown'
            };
        });

        // Sort by most recent first
        viewDetails.sort((a, b) => 
            new Date(b.viewedAt) - new Date(a.viewedAt)
        );

        this.viewData = {
            requestId: data.requestId,
            requestTitle: request.title,
            totalViews: views.length,
            currentViewCount: request.viewCount || 0,
            views: viewDetails,
            lastViewedAt: viewDetails.length > 0 ? viewDetails[0].viewedAt : null
        };

        console.log(`Tracked ${viewDetails.length} views`);
        return {
            success: true,
            message: "View tracking retrieved",
            count: viewDetails.length
        };
    }

    getData() {
        console.log("TrackViewsEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.viewData
        };
    }
}

module.exports = TrackViewsEntity;
