const { db } = require('../database');

class ViewHistoryEntity {
    constructor() {
        this.history = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewHistoryEntity: Initializing...");
        this.history = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewHistoryEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewHistoryEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Get all requests created by this user
        const userRequests = db.find('requests', { 
            createdBy: data.userId,
            isDeleted: false 
        });

        // Build history with view and shortlist counts
        this.history = userRequests.map(request => {
            const viewCount = db.count('requestViews', { requestId: request.id });
            const shortlistCount = db.count('shortlists', { 
                requestId: request.id,
                isActive: true 
            });

            return {
                request: request,
                viewCount: viewCount,
                shortlistCount: shortlistCount,
                status: request.status,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt
            };
        });

        // Sort by creation date (most recent first)
        this.history.sort((a, b) => 
            new Date(b.request.createdAt) - new Date(a.request.createdAt)
        );

        console.log(`Retrieved ${this.history.length} history items`);
        return {
            success: true,
            message: "History retrieved",
            count: this.history.length
        };
    }

    getData() {
        console.log("ViewHistoryEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: {
                history: this.history,
                count: this.history.length
            }
        };
    }
}

module.exports = ViewHistoryEntity;
