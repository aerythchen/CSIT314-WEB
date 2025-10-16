const { db } = require('../database');

class ViewRequestDetailsEntity {
    constructor() {
        this.request = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewRequestDetailsEntity: Initializing...");
        this.request = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewRequestDetailsEntity: Validating data...");
        
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
        console.log("ViewRequestDetailsEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Get request from database
        this.request = db.findById('requests', data.requestId);
        
        if (!this.request || this.request.isDeleted) {
            this.request = null;
            return {
                success: false,
                error: `Request with ID ${data.requestId} not found`
            };
        }

        // Increment view count
        const newViewCount = (this.request.viewCount || 0) + 1;
        db.update('requests', data.requestId, {
            viewCount: newViewCount
        });
        this.request.viewCount = newViewCount;

        // Track view if userId provided
        if (data.viewedBy) {
            db.insert('requestViews', {
                requestId: data.requestId,
                viewedBy: data.viewedBy
            });
        }

        console.log(`Request retrieved: ${this.request.title}`);
        return {
            success: true,
            message: "Request retrieved"
        };
    }

    getData() {
        console.log("ViewRequestDetailsEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.request
        };
    }
}

module.exports = ViewRequestDetailsEntity;

