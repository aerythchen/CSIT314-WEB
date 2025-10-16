const { db } = require('../database');

class TrackShortlistEntity {
    constructor() {
        this.shortlistData = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("TrackShortlistEntity: Initializing...");
        this.shortlistData = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("TrackShortlistEntity: Validating data...");
        
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
        console.log("TrackShortlistEntity: Processing data...");
        
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

        // Get all shortlists for this request (both active and inactive)
        const allShortlists = db.find('shortlists', { requestId: data.requestId });
        const activeShortlists = allShortlists.filter(s => s.isActive);

        // Get shortlist details with user information
        const shortlistDetails = activeShortlists.map(shortlist => {
            const user = db.findById('userProfiles', shortlist.userId);
            return {
                shortlistId: shortlist.id,
                addedAt: shortlist.addedAt,
                userId: shortlist.userId,
                userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                userType: user ? user.userType : 'unknown'
            };
        });

        // Sort by most recent first
        shortlistDetails.sort((a, b) => 
            new Date(b.addedAt) - new Date(a.addedAt)
        );

        this.shortlistData = {
            requestId: data.requestId,
            requestTitle: request.title,
            totalShortlists: activeShortlists.length,
            currentShortlistCount: request.shortlistCount || 0,
            shortlists: shortlistDetails,
            lastShortlistedAt: shortlistDetails.length > 0 ? shortlistDetails[0].addedAt : null,
            historicalCount: allShortlists.length // Including removed ones
        };

        console.log(`Tracked ${shortlistDetails.length} active shortlists`);
        return {
            success: true,
            message: "Shortlist tracking retrieved",
            count: shortlistDetails.length
        };
    }

    getData() {
        console.log("TrackShortlistEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.shortlistData
        };
    }
}

module.exports = TrackShortlistEntity;
