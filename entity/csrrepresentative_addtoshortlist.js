const { db } = require('../database');
const { ShortlistHelpers } = require('../database/helpers');

class AddToShortlistEntity {
    constructor() {
        this.shortlist = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("AddToShortlistEntity: Initializing...");
        this.shortlist = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("AddToShortlistEntity: Validating data...");
        
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
        console.log("AddToShortlistEntity: Processing data...");
        
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

        // Add to shortlist using helper
        const result = ShortlistHelpers.addToShortlist(data.requestId, data.userId);

        if (!result.success) {
            return result;
        }

        this.shortlist = result.data;

        console.log("Added to shortlist successfully");
        return {
            success: true,
            message: "Added to shortlist",
            data: {
                id: this.shortlist.id,
                requestId: data.requestId
            }
        };
    }

    getData() {
        console.log("AddToShortlistEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.shortlist
        };
    }
}

module.exports = AddToShortlistEntity;

