const { db } = require('../database');

class ViewShortlistDetailsEntity {
    constructor() {
        this.shortlistDetails = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewShortlistDetailsEntity: Initializing...");
        this.shortlistDetails = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewShortlistDetailsEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.requestId || typeof data.requestId !== 'string') {
            return { isValid: false, error: "Valid request ID is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewShortlistDetailsEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Find shortlist entry
        const shortlistEntry = db.findOne('shortlists', { 
            requestId: data.requestId,
            userId: data.userId,
            isActive: true
        });

        if (!shortlistEntry) {
            return {
                success: false,
                error: "Request not found in shortlist"
            };
        }

        // Get request details
        const request = db.findById('requests', data.requestId);
        if (!request || request.isDeleted) {
            return {
                success: false,
                error: "Request not found"
            };
        }

        // Get category details
        let category = null;
        if (request.categoryId) {
            category = db.findById('categories', request.categoryId);
        }

        // Get view count
        const viewCount = db.count('requestViews', { 
            requestId: data.requestId 
        });

        // Get shortlist count
        const shortlistCount = db.count('shortlists', { 
            requestId: data.requestId,
            isActive: true 
        });

        this.shortlistDetails = {
            shortlistEntry: shortlistEntry,
            request: request,
            category: category,
            viewCount: viewCount,
            shortlistCount: shortlistCount,
            addedAt: shortlistEntry.addedAt
        };

        console.log(`Shortlist details retrieved for request: ${request.title}`);
        return {
            success: true,
            message: "Shortlist details retrieved"
        };
    }

    getData() {
        console.log("ViewShortlistDetailsEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.shortlistDetails
        };
    }
}

module.exports = ViewShortlistDetailsEntity;

