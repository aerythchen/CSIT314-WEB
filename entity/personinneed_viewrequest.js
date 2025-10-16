const { db } = require('../database');

class ViewRequestEntity {
    constructor() {
        this.requests = [];
        this.selectedRequest = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewRequestEntity: Initializing...");
        this.requests = [];
        this.selectedRequest = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewRequestEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validActions = ["getUserRequests", "getById"];
        if (!data.action || !validActions.includes(data.action)) {
            return { isValid: false, error: "Valid action is required" };
        }

        if (data.action === "getUserRequests" && !data.userId) {
            return { isValid: false, error: "User ID is required for getUserRequests action" };
        }

        if (data.action === "getById" && !data.requestId) {
            return { isValid: false, error: "Request ID is required for getById action" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewRequestEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        if (data.action === "getUserRequests") {
            // Get all requests for this user
            this.requests = db.find('requests', { 
                createdBy: data.userId,
                isDeleted: false 
            });
            this.selectedRequest = null;
            
            console.log(`Fetched ${this.requests.length} requests`);
            return {
                success: true,
                message: "Requests retrieved",
                count: this.requests.length
            };
        }
        
        if (data.action === "getById") {
            // Get specific request
            this.selectedRequest = db.findById('requests', data.requestId);
            this.requests = [];
            
            if (!this.selectedRequest || this.selectedRequest.isDeleted) {
                this.selectedRequest = null;
                return {
                    success: false,
                    error: `Request with ID ${data.requestId} not found`
                };
            }
            
            console.log(`Request retrieved: ${this.selectedRequest.title}`);
            return {
                success: true,
                message: "Request retrieved"
            };
        }

        return {
            success: false,
            error: "Unknown action"
        };
    }

    getData() {
        console.log("ViewRequestEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        if (this.selectedRequest === null && this.requests !== null) {
            return {
                success: true,
                data: {
                    requests: this.requests,
                    count: this.requests.length
                }
            };
        }

        return {
            success: true,
            data: {
                request: this.selectedRequest,
                requests: []
            }
        };
    }
}

module.exports = ViewRequestEntity;
